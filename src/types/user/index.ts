import { Prisma } from '@prisma/client';

export interface IUser {
    emailOrPhone: string;
    password: string;
}

export interface IUserCreate {
    id: string;
    password: string;
}

export interface IUserResponse extends IUser {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserService {
    createUser(userData: Prisma.UserCreateInput): Promise<IUserResponse>;
    isExists(id: string): Promise<boolean>;
    findByEmailOrPhone(emailOrPhone: string): Promise<IUserResponse | null>;
    findById(id: number): Promise<IUserResponse | null>;
    encryptPassword(password: string): Promise<string>;
    verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
}
