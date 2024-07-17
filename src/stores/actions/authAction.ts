import authAPI from '@/apis/authApi';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk<
    {
        auth: AuthData;
        userInfo: User;
    },
    AuthPayload,
    {
        rejectValue: any;
    }
>('auth/login', async (data, { rejectWithValue }): Promise<any> => {
    try {
        const res = await authAPI.HandleAuth('/login', data, 'post');
        if (res.data) {
            return {
                auth: {
                    id: res.data.id,
                    username: res.data.username,
                    email: res.data.email,
                    accessToken: res.data.accessToken,
                },
                userInfo: {
                    id: res.data.id,
                    username: res.data.username,
                    fullName: res.data.fullName,
                    email: res.data.email,
                    avatar: res.data.avatar,
                    role: res.data.role,
                },
            };
        }
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const sendOTP = createAsyncThunk<
    OTP,
    { email: string },
    {
        rejectValue: any;
    }
>('auth/sendOTP', async (data, { rejectWithValue }): Promise<any> => {
    try {
        const res = await authAPI.HandleAuth('/send-reset-password-email', data, 'post');
        if (res.data) {
            return {
                otp: res.data.otp,
                expiredIn: res.data.expiredIn,
                email: data.email,
                done: false,
            } as OTP;
        }
    } catch (error) {
        return rejectWithValue(error);
    }
});
