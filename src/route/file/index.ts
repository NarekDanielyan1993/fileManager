import express, { Router } from 'express';

import { FILE_API } from 'constant/api';
import FileController from 'controller/file';
import { fileUploadMiddleware } from 'middleware/fileUpload';
import FileRepository from 'repository/file';
import { FileService } from 'service/file';
import isAuth from 'utils/middleware';

const fileRepository = new FileRepository();
const fileService = new FileService(fileRepository);
const fileController = new FileController(fileService);

const fileRoutes: Router = express.Router();

fileRoutes.get(FILE_API.GET_FILES, isAuth, fileController.getPaginatedFiles);
fileRoutes.get(FILE_API.GET_FILE, isAuth, fileController.getFile);
fileRoutes.post(
    FILE_API.CREATE,
    isAuth,
    fileUploadMiddleware,
    fileController.createFile,
);
fileRoutes.put(
    FILE_API.UPDATE_FILE,
    isAuth,
    fileUploadMiddleware,
    fileController.updateFile,
);
fileRoutes.delete(FILE_API.DELETE_FILE, isAuth, fileController.deleteFile);
fileRoutes.get(FILE_API.DOWNLOAD_FILE, fileController.downloadFile);

export default fileRoutes;
