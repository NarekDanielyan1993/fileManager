import { MAX_FILE_SIZE } from 'constant/file';
import { corsOptions } from 'constant/middleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, Router } from 'express';
import helmet from 'helmet';
import 'lib/strategy';
import passport from 'passport';

class App {
    private expressApp: Express;

    constructor() {
        this.expressApp = express();
    }

    public initializeMiddlewares() {
        this.expressApp.use(
            express.urlencoded({ limit: MAX_FILE_SIZE, extended: true }),
        );
        this.expressApp.use(express.json({ limit: MAX_FILE_SIZE }));
        this.expressApp.use(helmet());
        this.expressApp.use(cookieParser());
        this.expressApp.use(cors(corsOptions));
        this.expressApp.use(passport.initialize());
    }

    public initializeRoutes(routes: Router) {
        this.expressApp.use(routes);
    }

    public addMiddleware(middleware: any) {
        this.expressApp.use(middleware);
    }

    public addRoute(router: express.Router) {
        this.expressApp.use(router);
    }

    public async init(port: number) {
        try {
            this.expressApp.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        } catch (error) {
            console.log('Failed to start the server:', error);
        }
    }

    public getApp(): Express {
        return this.expressApp;
    }
}

export default App;
