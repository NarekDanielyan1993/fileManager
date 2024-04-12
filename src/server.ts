import App from 'lib/app';
import errorMiddleware from 'middleware/error';
import Config from 'utils/config';
import routes from './route';

const app = new App();

app.initializeMiddlewares();
app.initializeRoutes(routes);
app.addMiddleware(errorMiddleware);

app.init(Number(Config.getEnv('PORT')) || 6000);
