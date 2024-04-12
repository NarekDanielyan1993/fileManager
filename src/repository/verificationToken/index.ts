import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client/extension';
import prismaAdapter from 'lib/db';
import { IVerificationTokenResponse } from 'types/verificationToken';

class VerificationTokenRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient = prismaAdapter) {
        this.prisma = prisma;
    }

    public create = async (
        tokenData: Prisma.VerificationTokenCreateInput,
    ): Promise<IVerificationTokenResponse> => {
        const createdToken = await this.prisma.verificationToken.upsert({
            where: {
                identifier: tokenData.identifier,
            },
            update: {
                ...tokenData,
            },
            create: {
                ...tokenData,
            },
        });
        return createdToken;
    };

    public findOne = async (
        tokenData: Prisma.VerificationTokenWhereInput,
    ): Promise<IVerificationTokenResponse | null> => {
        const data = await this.prisma.verificationToken.findFirst({
            where: {
                ...tokenData,
            },
        });
        return data;
    };

    public deleteOne = async (
        tokenData: Prisma.VerificationTokenWhereInput,
    ): Promise<any> =>
        await this.prisma.verificationToken.delete({
            where: {
                ...tokenData,
            },
        });
}

export default VerificationTokenRepository;
