import { Prisma } from '@prisma/client';

export interface IFile {
    name: string;
    extension: string;
    mimetype: string;
    path: string;
    size: number;
    userId: number;
}

export interface IFileCreate {
    name: string;
    extension: string;
    mimetype: string;
    size: number;
    path: string;
    userId: number;
}

export interface IFileResponse extends IFile {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFileService {
    createFile(taskData: IFileCreate): Promise<IFileResponse>;
    getFile(id: number): Promise<IFileResponse>;
    getPaginatedFiles(
        userId: number,
        limit: number,
        skip: number,
    ): Promise<IFileResponse[]>;
    updateFile(
        id: number,
        fileData: Prisma.FileUpdateInput,
    ): Promise<IFileResponse | null>;
    deleteFile(id: number): Promise<IFileResponse | null>;
}
