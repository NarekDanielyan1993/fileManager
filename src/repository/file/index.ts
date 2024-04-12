import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client/extension';
import { FILE_ERROR_MESSAGES } from 'constant/error';
import prismaAdapter from 'lib/db';
import { FileError, InternalServerError } from 'lib/error';
import { IFileResponse } from 'types/file/index.js';

class FileRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient = prismaAdapter) {
        this.prisma = prisma;
    }

    async find(fileData: Prisma.FileFindFirstArgs): Promise<IFileResponse[]> {
        try {
            const files = await this.prisma.file.findMany({
                ...fileData,
            });
            return files;
        } catch (error) {
            throw new FileError(FILE_ERROR_MESSAGES.FILES_GET);
        }
    }

    async findOne(id: number): Promise<IFileResponse> {
        try {
            const file = await this.prisma.file.findFirst({
                where: {
                    id,
                },
            });
            return file;
        } catch (error) {
            throw new FileError(FILE_ERROR_MESSAGES.FILE_GET);
        }
    }

    async create(fileData: Prisma.FileCreateInput): Promise<IFileResponse> {
        try {
            const createdFile = await this.prisma.file.create({
                data: {
                    ...fileData,
                },
            });
            return createdFile;
        } catch (error) {
            throw new FileError(FILE_ERROR_MESSAGES.FILE_CREATE);
        }
    }

    async updateById(
        id: number,
        fileData: Prisma.FileUpdateInput,
    ): Promise<IFileResponse | null> {
        try {
            return await this.prisma.file.update({
                where: {
                    id,
                    userId: fileData.userId,
                },
                data: {
                    ...fileData,
                },
            });
        } catch (error) {
            throw new InternalServerError();
        }
    }

    async delete(id: number): Promise<IFileResponse | null> {
        try {
            const deletedFile = await this.prisma.file.delete({
                where: {
                    id,
                },
            });
            return deletedFile;
        } catch (error) {
            throw new FileError(FILE_ERROR_MESSAGES.FILE_DELETE);
        }
    }
}

export default FileRepository;
