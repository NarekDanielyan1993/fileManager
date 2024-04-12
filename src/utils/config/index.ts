import 'dotenv/config';
import { EnvVariableTypes } from 'types/database';

class Config {
    public static getEnv(key: EnvVariableTypes): string {
        const value = process.env[key];

        if (typeof value === 'string') {
            return value;
        }
        return '';
    }
}

export default Config;
