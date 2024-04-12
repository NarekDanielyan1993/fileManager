import { Prisma } from '@prisma/client';

export interface IVerificationToken {
    identifier: string;
    token: string;
    expires: Date;
}

export interface IVerificationTokenCreate {
    identifier: number;
    token: string;
    expires: Date;
}

export interface IVerificationTokenResponse extends IVerificationToken {
    id: number;
}

export interface IVerificationTokenService {
    createToken(
        tokenData: IVerificationTokenCreate,
    ): Promise<IVerificationTokenResponse>;
    isTokenValid(userToken: string, verificationToken: string): boolean;
    isTokenExpired(
        userTokenExpiration: number,
        verificationTokenExpiration: Date,
    ): boolean;
    deleteVerificationToken(
        id: number,
    ): Promise<IVerificationTokenResponse | null>;
    deleteVerificationTokenByIdentifier(
        tokenData: Prisma.VerificationTokenWhereInput,
    ): Promise<IVerificationTokenResponse | null>;
}
