import { Prisma } from '@prisma/client';
import VerificationTokenRepository from 'repository/verificationToken';
import {
    IVerificationTokenCreate,
    IVerificationTokenResponse,
    IVerificationTokenService,
} from 'types/verificationToken';

class VerificationService implements IVerificationTokenService {
    private repository: VerificationTokenRepository;

    constructor(repository: VerificationTokenRepository) {
        this.repository = repository;
    }

    public createToken = async (
        tokenData: IVerificationTokenCreate,
    ): Promise<IVerificationTokenResponse> => {
        const createdToken: IVerificationTokenResponse =
            await this.repository.create(tokenData);
        return createdToken;
    };

    public getByIdentifier = async (
        id: number,
    ): Promise<IVerificationTokenResponse | null> =>
        await this.repository.findOne({ identifier: id });

    public isTokenValid(userToken: string, verificationToken: string): boolean {
        return userToken === verificationToken;
    }

    public isTokenExpired(
        userTokenExpiration: number,
        verificationTokenExpiration: Date,
    ): boolean {
        const verificationTokenExpirationTimestamp =
            new Date(verificationTokenExpiration).getTime() / 1000;
        return verificationTokenExpirationTimestamp < userTokenExpiration;
    }

    public deleteVerificationToken = async (
        id: number,
    ): Promise<IVerificationTokenResponse | null> =>
        await this.repository.deleteOne({ id });

    public deleteVerificationTokenByIdentifier = async (
        tokenData: Prisma.VerificationTokenWhereInput,
    ): Promise<IVerificationTokenResponse | null> =>
        await this.repository.deleteOne({
            ...tokenData,
        });
}

export default VerificationService;
