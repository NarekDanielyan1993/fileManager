import { USER_VALIDATION_ERRORS } from 'constant/error';
import z from 'zod';

export const userValidationSchema = z.object({
    id: z.string({}).refine(
        (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const russianPhoneRegex = /^\+7\d{10}$/;
            return emailRegex.test(value) || russianPhoneRegex.test(value);
        },
        { message: USER_VALIDATION_ERRORS.EMAIL_OR_PHONE },
    ),
    password: z
        .string()
        .min(6, { message: USER_VALIDATION_ERRORS.PASSWORD_MIN })
        .max(32, { message: USER_VALIDATION_ERRORS.PASSWORD_MAX }),
});
