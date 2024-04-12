import { FILE_ERROR_MESSAGES } from 'constant/error';
import { NextFunction, Request, Response } from 'express';
import { FileError, NotFound } from 'lib/error';
import path from 'path';
import { IPaginatedQueryParams } from 'types/database';
import { IFileService } from 'types/file';
import {
    deleteFile,
    getUploadDirectory,
    openFile,
    parsePaginationParams,
    saveFile,
} from 'utils/helper';

class FileController {
    private fileService: IFileService;

    constructor(fileService: IFileService) {
        this.fileService = fileService;
    }

    public getPaginatedFiles = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { list_size, page } = req.query as IPaginatedQueryParams;
        const { pageSize, skip } = parsePaginationParams(list_size, page);
        try {
            const files = await this.fileService.getPaginatedFiles(
                req.user as number,
                pageSize,
                skip,
            );
            res.status(200).json(files);
        } catch (error) {
            next(error);
        }
    };

    public getFile = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const id = req.params.id;
            const file = await this.fileService.getFile(Number(id));
            if (!file) {
                throw new NotFound(FILE_ERROR_MESSAGES.FILE_NOT_FOUND);
            }
            res.status(200).json(file);
        } catch (error) {
            next(error);
        }
    };

    public createFile = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { files } = req.fileData;

            const file = files.file[0];

            const ext = path.extname(file.originalFilename as string);

            const createdFile = await this.fileService.createFile({
                mimetype: file.mimetype as string,
                name: file.originalFilename as string,
                path: file.newFilename,
                size: file.size,
                userId: req.user as number,
                extension: ext,
            });

            const fileToStore = await openFile(file.filepath);

            await saveFile(fileToStore, createdFile.path);

            res.status(201).json(createdFile);
        } catch (error) {
            next(error);
        }
    };

    public updateFile = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const id = req.params.id;
            const { files } = req.fileData;
            const file = files.file[0];

            const ext = path.extname(file.originalFilename as string);

            const updatedFile = await this.fileService.updateFile(Number(id), {
                mimetype: file.mimetype as string,
                name: file.originalFilename as string,
                size: file.size,
                userId: req.user as number,
                extension: ext,
            });
            console.log(updatedFile?.path);

            if (!updatedFile) {
                throw new FileError(FILE_ERROR_MESSAGES.FILE_NOT_FOUND);
            }

            const fileToStore = await openFile(file.filepath);
            await saveFile(fileToStore, updatedFile.path);

            res.status(200).json(updatedFile);
        } catch (error) {
            next(error);
        }
    };

    public deleteFile = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const id = req.params.id;
            const deletedFile = await this.fileService.deleteFile(Number(id));
            if (!deletedFile) {
                throw new FileError(FILE_ERROR_MESSAGES.FILE_NOT_FOUND);
            }
            await deleteFile(deletedFile.path);
            res.status(200).json({ msg: 'success' });
        } catch (error) {
            next(error);
        }
    };

    public downloadFile = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const id = req.params.id;
            const file = await this.fileService.getFile(Number(id));
            if (!file) {
                throw new NotFound(FILE_ERROR_MESSAGES.FILE_NOT_FOUND);
            }

            res.download(getUploadDirectory(file.path));
        } catch (error) {
            next(error);
        }
    };
}

export default FileController;
