import { API_URL } from '@/constants/apiUrl';
import axiosClient from './index';
import { AxiosRequestConfig } from 'axios';

class AuthAPI {
    HandleAuth = async (
        url: string,
        data?: any,
        method?: 'get' | 'post' | 'put' | 'delete',
        option: AxiosRequestConfig = {},
    ) => {
        return await axiosClient(`${process.env.EXPO_PUBLIC_BASE_URL}/auth${url}`, {
            method: method || 'get',
            data,
            params: method === 'get' ? data : undefined,
            ...option,
        });
    };

    login = async (data: FormLogin, option: AxiosRequestConfig = {}): Promise<AuthData> => {
        const res = await this.HandleAuth(API_URL.auth.login, data, 'post', option);
        return res.data;
    };

    sendOTP = async (data: { email: string }, option: AxiosRequestConfig = {}): Promise<Omit<OTP, 'done'>> => {
        const res = await this.HandleAuth(API_URL.auth.sendOTP, data, 'post', option);
        return res.data;
    };

    resetPassword = async (data: FormResetPassword, option: AxiosRequestConfig = {}): Promise<{ email: String }> => {
        const res = await this.HandleAuth(API_URL.auth.resetPassword, data, 'post', option);
        return res.data;
    };

    changePassword = async (data: FormChangePassword, option: AxiosRequestConfig = {}): Promise<{ email: string }> => {
        const res = await this.HandleAuth(API_URL.auth.changePassword, data, 'post', option);
        return res.data;
    };
}

const authAPI = new AuthAPI();

export default authAPI;
