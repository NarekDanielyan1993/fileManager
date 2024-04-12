import { PrismaClient } from '@prisma/client';
import Config from 'utils/config';

let prismaAdapter: PrismaClient;

if (Config.getEnv('NODE_ENV') === 'production') {
    prismaAdapter = new PrismaClient();
} else {
    if (!(global as any).prisma) {
        (global as any).prisma = new PrismaClient();
    }
    prismaAdapter = (global as any).prisma;
}

export default prismaAdapter;
