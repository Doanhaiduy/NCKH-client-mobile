import { z } from 'zod';
import { Regex } from '.';

type passwordType = 'Login' | 'SignUp';

export const schemasCustom: {
    username: z.ZodString;
    password: (type: passwordType) => z.ZodString;
    confirmPassword: z.ZodString;
} = {
    username: z
        .string()
        .min(1, { message: 'Mã số sinh viên là bắt buộc' })
        .max(8, { message: 'Mã số sinh viên không hợp lệ' }),

    password: (type: passwordType) => {
        if (type === 'Login') {
            return z.string().min(1, { message: 'Mật khẩu là bắt buộc' });
        }
        return z.string().min(8, { message: 'Mật khẩu phải chứa ít nhất 8 ký tự' }).regex(Regex.password, {
            message: 'Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số',
        });
    },

    confirmPassword: z.string().min(8, {
        message: 'Mật khẩu không khớp',
    }),
};
