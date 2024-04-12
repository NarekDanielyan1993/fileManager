import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { USER_ERROR_MESSAGES } from 'constant/error';
import { InternalServerError } from 'lib/error';
import UserRepository from 'repository/user';
import { IUserResponse, IUserService } from 'types/user';
import Config from 'utils/config';

class UserService implements IUserService {
    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    public createUser = async (
        userData: Prisma.UserCreateInput,
    ): Promise<IUserResponse> => {
        const createdUser: IUserResponse = await this.repository.create({
            emailOrPhone: userData.emailOrPhone,
            password: userData.password,
        });
        return createdUser;
    };

    async isExists(id: string): Promise<boolean> {
        const user = await this.repository.findOne({ emailOrPhone: id });
        return !!user;
    }

    async findByEmailOrPhone(id: string): Promise<IUserResponse | null> {
        const updatedUser = await this.repository.findOne({ emailOrPhone: id });
        return updatedUser;
    }

    async findById(id: number): Promise<IUserResponse | null> {
        const updatedUser = await this.repository.findOne({ id });
        return updatedUser;
    }

    async encryptPassword(password: string): Promise<string> {
        try {
            const hashedPassword = await bcrypt.hash(
                password,
                Number(Config.getEnv('HASH_SAULT')),
            );
            return hashedPassword;
        } catch (error) {
            throw new InternalServerError(USER_ERROR_MESSAGES.ENCRYPT_PASSWORD);
        }
    }

    async verifyPassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        try {
            const isMatch = await bcrypt.compare(password, hashedPassword);
            return isMatch;
        } catch (error) {
            throw new InternalServerError(USER_ERROR_MESSAGES.VERIFY_PASSWORD);
        }
    }
}

export default UserService;
