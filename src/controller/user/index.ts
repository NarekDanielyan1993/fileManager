/* eslint-disable max-lines */
import {
    EXPIRES_IN_1_DAY,
    // JWT_EXPIRES_IN_10_MINUTES,
    JWT_EXPIRES_IN_1_DAY,
} from 'constant/auth';
import { USER_ERROR_MESSAGES } from 'constant/error';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { InternalServerError, NotAuthorized, NotFound } from 'lib/error';
import VerificationTokenRepository from 'repository/verificationToken';
import VerificationService from 'service/verificationToken';
import { IUserCreate, IUserService } from 'types/user';
import Config from 'utils/config';
import {
    generateJwtToken,
    isExist,
    setCookie,
    verifyJwtToken,
} from 'utils/helper';
export default class UserController {
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    public getUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            res.status(200).json({ id: req.user });
        } catch (error) {
            next(error);
        }
    };

    public createUser = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const userData: IUserCreate = req.body;

            const isUserWithEmailExists = await this.userService.isExists(
                userData.id,
            );

            if (isUserWithEmailExists) {
                throw new InternalServerError(USER_ERROR_MESSAGES.EXIST_USER);
            }

            const hashedPassword = await this.userService.encryptPassword(
                userData.password,
            );

            await this.userService.createUser({
                emailOrPhone: userData.id,
                password: hashedPassword,
            });

            res.status(200).json({ msg: 'success' });
        } catch (error) {
            next(error);
        }
    };

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id, password } = req.body;

            const user = await this.userService.findByEmailOrPhone(id);

            if (!isExist(user)) {
                throw new NotFound(USER_ERROR_MESSAGES.NOT_FOUND_USER);
            }

            const isPasswordValid = await this.userService.verifyPassword(
                password,
                user.password,
            );

            if (!isPasswordValid) {
                throw new InternalServerError(
                    USER_ERROR_MESSAGES.INCORRECT_PASSWORD,
                );
            }

            const accessToken = generateJwtToken({
                id: user.id,
            });

            const refreshToken = generateJwtToken({
                id: user.id,
                expiresIn: JWT_EXPIRES_IN_1_DAY,
                secretKey: Config.getEnv('REFRESH_TOKEN_KEY'),
            });

            const verificationTokenService = new VerificationService(
                new VerificationTokenRepository(),
            );

            await verificationTokenService.createToken({
                token: refreshToken,
                expires: new Date(Date.now() + EXPIRES_IN_1_DAY),
                identifier: user.id,
            });

            setCookie(req, res, 'refreshToken', refreshToken, {
                httpOnly: true,
            });

            res.status(200).json({ accessToken });
        } catch (error) {
            next(error);
        }
    };

    public updateAccessToken = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const cookies = req.cookies;
            if (!cookies.refreshToken) {
                throw new NotAuthorized();
            }

            const refreshToken = cookies.refreshToken;

            const decodedToken: JwtPayload = verifyJwtToken(
                refreshToken,
                Config.getEnv('REFRESH_TOKEN_KEY'),
            );

            const verificationTokenService = new VerificationService(
                new VerificationTokenRepository(),
            );

            const userTokenData =
                await verificationTokenService.getByIdentifier(decodedToken.id);
            if (
                !isExist(userTokenData) ||
                decodedToken.id !== userTokenData.identifier
            ) {
                throw new NotAuthorized();
            }

            const accessToken = generateJwtToken({
                id: decodedToken.id,
            });

            res.status(200).json({ accessToken });
        } catch (error) {
            res.clearCookie('refreshToken', { httpOnly: true });
            next(error);
        }
    };

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const decodedToken = verifyJwtToken(
                req.cookies.refreshToken,
                Config.getEnv('REFRESH_TOKEN_KEY'),
            );
            console.log(decodedToken);
            const verificationTokenService = new VerificationService(
                new VerificationTokenRepository(),
            );
            await verificationTokenService.deleteVerificationTokenByIdentifier({
                identifier: decodedToken.id,
                token: req.cookies.refreshToken,
            });
            res.clearCookie('refreshToken', {
                httpOnly: true,
            });
            res.status(200).json({ msg: 'success' });
        } catch (error) {
            next(error);
        }
    };
}
