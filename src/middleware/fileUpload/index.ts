// import FormParser from 'lib/formParser';
// import CloudinaryService from 'lib/upload';

import { FILE_ERROR_MESSAGES } from 'constant/error';
import { MAX_FILE_SIZE } from 'constant/file';
import { NextFunction, Response } from 'express';
import { IncomingMessage } from 'http';
import { FileError, NotFound } from 'lib/error';
import FormParser from 'lib/formParser';

export const fileUploadMiddleware = async (
    req: IncomingMessage,
    res: Response,
    next: NextFunction,
) => {
    try {
        const formParser = new FormParser();
        const { fields, files } = await formParser.parseForm(req);

        if (!(Array.isArray(files.file) && files.file.length > 0)) {
            const error = new NotFound(FILE_ERROR_MESSAGES.FILE_NOT_FOUND);
            await next(error);
        } else if (files.file[0].size > MAX_FILE_SIZE) {
            const error = new FileError(FILE_ERROR_MESSAGES.LIMIT_FILE_SIZE);
            await next(error);
        }
        req.fileData = { files, fields };
        await next();
    } catch (error) {
        console.log(error);
        throw error;
    }
};
