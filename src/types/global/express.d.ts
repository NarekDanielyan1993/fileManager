declare global {
    namespace Express {
        interface Request {
            fileData: any;
        }
    }
}

declare module 'http' {
    interface IncomingMessage {
        fileData: any;
    }
}
