import { API_URL } from '@/constants/apiUrl';
import axiosClient from './index';
import { AxiosRequestConfig } from 'axios';
import { appInfo } from '@/constants/appInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    forgotPassword = async (data: { email: string }, option: AxiosRequestConfig = {}): Promise<Omit<OTP, 'done'>> => {
        return await this.HandleAuth(API_URL.auth.forgotPassword, data, 'post', option);
    };

    verifyOTP = async (
        data: { email: string; otp: string },
        option: AxiosRequestConfig = {},
    ): Promise<{ email: String }> => {
        return await this.HandleAuth(API_URL.auth.verifyOTP, data, 'post', option);
    };

    resetPassword = async (data: FormResetPassword, option: AxiosRequestConfig = {}): Promise<{ email: String }> => {
        return await this.HandleAuth(API_URL.auth.resetPassword, data, 'post', option);
    };

    changePassword = async (data: FormChangePassword, option: AxiosRequestConfig = {}): Promise<{ email: string }> => {
        return await this.HandleAuth(API_URL.auth.changePassword, data, 'post', option);
    };
    logout = async (
        data = {
            refreshToken: '',
        },
        option: AxiosRequestConfig = {},
    ): Promise<{ email: string }> => {
        const authStorage = await AsyncStorage.getItem('auth');
        const refreshToken = authStorage && JSON.parse(authStorage).refreshToken;
        data.refreshToken = refreshToken;
        return await this.HandleAuth(API_URL.auth.logout, data, 'post', option);
    };
}

const authAPI = new AuthAPI();

export default authAPI;
