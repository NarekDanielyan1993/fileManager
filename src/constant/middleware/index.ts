import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: true,
    allowedHeaders: [
        'Origin',
        'X-CSRF-Token',
        'X-Requested-With',
        'Accept',
        'Accept-Version',
        'Content-Length',
        'Content-MD5',
        'Content-Type',
        'Date',
        'X-Api-Version',
        'Authorization',
    ],
};
