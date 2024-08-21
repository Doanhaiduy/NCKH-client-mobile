import { API_URL } from '@/constants/apiUrl';
import axiosClient from './index';
import { AxiosRequestConfig } from 'axios';
import { appInfo } from '@/constants/appInfo';

class AuthAPI {
    HandleAuth = async <T>(
        url: string,
        data?: any,
        method?: 'get' | 'post' | 'put' | 'delete',
        option: AxiosRequestConfig = {},
    ): Promise<T> => {
        return await axiosClient(`${appInfo.base_url}/auth${url}`, {
            method: method || 'get',
            data,
            params: method === 'get' ? data : undefined,
            ...option,
        });
    };

    login = async (data: FormLogin, option: AxiosRequestConfig = {}): Promise<AuthData> => {
        return await this.HandleAuth(API_URL.auth.login, data, 'post', option);
    };

    sendOTP = async (data: { email: string }, option: AxiosRequestConfig = {}): Promise<Omit<OTP, 'done'>> => {
        return await this.HandleAuth(API_URL.auth.sendOTP, data, 'post', option);
    };

    resetPassword = async (data: FormResetPassword, option: AxiosRequestConfig = {}): Promise<{ email: String }> => {
        return await this.HandleAuth(API_URL.auth.resetPassword, data, 'post', option);
    };

    changePassword = async (data: FormChangePassword, option: AxiosRequestConfig = {}): Promise<{ email: string }> => {
        return await this.HandleAuth(API_URL.auth.changePassword, data, 'post', option);
    };
}

const authAPI = new AuthAPI();

export default authAPI;
