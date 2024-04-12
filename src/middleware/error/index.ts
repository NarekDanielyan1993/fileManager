import { NextFunction, Request, Response } from 'express';
import { AppError, COMMON_ERROR_MESSAGES } from 'lib/error';

function errorMiddleware(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const statusCode = err.httpCode || 500;
    console.log('Unexpected error:', err.stack);
    if (err.isOperational) {
        return res.status(statusCode).json(err);
    }

    res.status(500).json({
        message: COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
}

export default errorMiddleware;
