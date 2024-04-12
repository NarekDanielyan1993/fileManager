import { USER_API } from 'constant/api';
import UserController from 'controller/user';
import express, { Router } from 'express';
import UserRepository from 'repository/user';
import UserService from 'service/user';
import { validateRequest } from 'utils/helper';
import isAuth from 'utils/middleware';
import { userValidationSchema } from 'utils/validation/user';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const userRoutes: Router = express.Router();
userRoutes.post(
    USER_API.SIGN_UP,
    validateRequest(userValidationSchema),
    userController.createUser,
);
userRoutes.post(
    USER_API.LOGIN,
    validateRequest(userValidationSchema),
    userController.login,
);
userRoutes.put(USER_API.UPDATE_ACCESS_TOKEN, userController.updateAccessToken);
userRoutes.post(USER_API.INFO, isAuth, userController.getUser);
userRoutes.post(USER_API.LOG_OUT, isAuth, userController.logout);

export default userRoutes;
