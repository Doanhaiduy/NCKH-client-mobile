import { AxiosRequestConfig } from 'axios';
import axiosClient from './index';
import { Platform } from 'react-native';
import QueryString from 'qs';
import { appInfo } from '@/constants/appInfo';

class UtilAPI {
    HandleUtil = async <T>(
        url: string,
        data?: any,
        method?: 'get' | 'post' | 'put' | 'delete',
        options: AxiosRequestConfig = {},
    ): Promise<T> => {
        return await axiosClient(`${appInfo.base_url}/utils${url}`, {
            method: method || 'get',
            data,
            params: method === 'get' ? data : undefined,
            ...options,
        });
    };

    createAlert = async (payload: AlertPayload, options: AxiosRequestConfig = {}): Promise<any> => {
        return await this.HandleUtil('/create-alert', payload, 'post', options);
    };
}

const utilAPI = new UtilAPI();

export default utilAPI;
