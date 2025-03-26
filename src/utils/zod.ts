import { z } from 'zod';
import { Regex } from '.';

type passwordType = 'Login' | 'SignUp';

export const schemasCustom = (t: (key: string) => string) => ({
    username: z
        .string()
        .min(1, { message: t('schemas_custom_zod.username_required') })
        .min(8, { message: t('schemas_custom_zod.username_invalid') }),

    email: z
        .string()
        .min(1, { message: t('schemas_custom_zod.email_required') })
        .email({ message: t('schemas_custom_zod.email_invalid') }),

    password: (type: passwordType) => {
        if (type === 'Login') {
            return z.string().min(1, { message: t('schemas_custom_zod.password_required') });
        }
        return z
            .string()
            .min(8, { message: t('schemas_custom_zod.password_min_length') })
            .regex(Regex.password, {
                message: t('schemas_custom_zod.password_invalid'),
            });
    },

    confirmPassword: z.string().min(8, {
        message: t('schemas_custom_zod.confirm_password_invalid'),
    }),
});
