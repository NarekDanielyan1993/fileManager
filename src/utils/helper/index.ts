import bcrypt from 'bcryptjs';
import { EXPIRES_IN_1_DAY, JWT_EXPIRES_IN_10_MINUTES } from 'constant/auth';
import { FILE_ERROR_MESSAGES } from 'constant/error';
import { FILE_PAGINATION_PARAMS_DEFAULT, MAX_FILE_SIZE } from 'constant/file';
import Cookies from 'cookies';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { readFile, unlink, writeFile } from 'fs/promises';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { FileError, InternalServerError, ValidationError } from 'lib/error';
import { join } from 'path';
import { IParsedPaginatedQueryParams } from 'types/database';
import Config from 'utils/config';
import { ZodRawShape, z } from 'zod';

export const validateRequest =
    <T extends ZodRawShape>(schema: z.ZodObject<T>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            await next();
        } catch (error: any) {
            console.log(error);
            if (error.name === 'ZodError') {
                console.log(
                    error?.issues?.map((issue: any) => ({
                        [issue.path]: issue.message,
                    })),
                );
                const validationError = new ValidationError(
                    error?.issues?.map((issue: any) => ({
                        [issue.path]: issue.message,
                    })),
                );
                next(validationError);
            }
            next(error);
        }
    };

export const getUploadDirectory = (filename = '') =>
    join(process.cwd(), 'uploads', filename);

export const isExist = (item: unknown): item is boolean =>
    item !== undefined && item !== null;

export const openFile = async (path: string): Promise<Buffer> => {
    try {
        return await readFile(path);
    } catch (error) {
        throw new FileError(FILE_ERROR_MESSAGES.FILE_READ);
    }
};

export const saveFile = async (file: any, filename: string): Promise<void> => {
    try {
        await writeFile(getUploadDirectory(filename), file);
    } catch (error) {
        throw new FileError(FILE_ERROR_MESSAGES.FILE_UPDATE);
    }
};

export const deleteFile = async (
    filename: string,
    // directory: string = Config.getEnv('UPLOAD_DIRECTORY'),
): Promise<void> => {
    try {
        await unlink(getUploadDirectory(filename));
    } catch (error) {
        throw new FileError(FILE_ERROR_MESSAGES.FILE_DELETE);
    }
};

export const parsePaginationParams = (
    pageSize: string,
    page: string,
): IParsedPaginatedQueryParams => {
    const parsedPaginatedParams = {} as IParsedPaginatedQueryParams;
    parsedPaginatedParams.pageSize = pageSize
        ? Number(pageSize)
        : FILE_PAGINATION_PARAMS_DEFAULT.FILE_SIZE;
    parsedPaginatedParams.pageNumber = page
        ? Number(page)
        : FILE_PAGINATION_PARAMS_DEFAULT.page;
    parsedPaginatedParams.skip =
        (parsedPaginatedParams.pageNumber - 1) * parsedPaginatedParams.pageSize;
    return parsedPaginatedParams;
};

export const generateJwtToken = ({
    id,
    expiresIn = JWT_EXPIRES_IN_10_MINUTES,
    secretKey = Config.getEnv('ACCESS_TOKEN_KEY'),
}: {
    id: number;
    expiresIn?: string;
    secretKey?: string;
}): string => {
    try {
        const token = jwt.sign({ id }, secretKey, {
            expiresIn,
        });
        return token;
    } catch (error) {
        throw new InternalServerError();
    }
};

export const verifyJwtToken = (
    token: string,
    secretKey: string = Config.getEnv('ACCESS_TOKEN_KEY'),
): JwtPayload => {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded as JwtPayload;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export async function generateBcryptToken(payload: string, saltRounds = 10) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(payload, salt);

    return hash;
}

export function setCookie(
    req: Request,
    res: Response,
    name: string,
    value: string,
    options?: CookieOptions,
) {
    const defaultCookieOptions: CookieOptions = {
        httpOnly: false,
        secure: false,
        maxAge: EXPIRES_IN_1_DAY,
        sameSite: 'strict',
    };

    const cookies = new Cookies(req, res);
    cookies.set(name, value, { ...defaultCookieOptions, ...options });
}

export const isFileExceedsSizeLimit = (file: File) => file.size > MAX_FILE_SIZE;
