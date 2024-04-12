import { BASE_API } from 'constant/api';
import express from 'express';
import fileRoutes from 'route/file';
import userRoutes from './user';

const routes = express.Router();

routes.use(BASE_API, fileRoutes);
routes.use(BASE_API, userRoutes);

export default routes;
