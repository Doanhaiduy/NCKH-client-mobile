import { AxiosRequestConfig } from 'axios';
import axiosClient from './index';
import { Platform } from 'react-native';
import QueryString from 'qs';
import { appInfo } from '@/constants/appInfo';

class UserAPI {
    HandleUser = async <T>(
        url: string,
        data?: any,
        method?: 'get' | 'post' | 'put' | 'delete',
        options: AxiosRequestConfig = {},
    ): Promise<T> => {
        return await axiosClient(`${appInfo.base_url}/users${url}`, {
            method: method || 'get',
            data,
            params: method === 'get' ? data : undefined,
            ...options,
        });
    };

    getAttendances = async (
        userId: string,
        data?: EventsParams,
        option: AxiosRequestConfig = {},
    ): Promise<Attendances> => {
        if (Platform.OS === 'ios') {
            return await this.HandleUser(
                `/${userId}/attendances?${QueryString.stringify({
                    ...data,
                })}`,
                undefined,
                'get',
                option,
            );
        }
        return await this.HandleUser(`/${userId}/attendances`, { ...data }, 'get');
    };

    getTrainingPoints = async (
        userId: string,
        data?: TrainingPointsParams,
        option: AxiosRequestConfig = {},
    ): Promise<TrainingPoint> => {
        if (Platform.OS === 'ios') {
            return await this.HandleUser(
                `/${userId}/training-points?${QueryString.stringify({
                    ...data,
                })}`,
                undefined,
                'get',
                option,
            );
        }
        return await this.HandleUser(`/${userId}/training-points`, { ...data }, 'get');
    };

    getNotifications = async (userId: string, data = {}, option: AxiosRequestConfig = {}): Promise<_Notification[]> => {
        if (Platform.OS === 'ios') {
            return await this.HandleUser(
                `/${userId}/notifications?${QueryString.stringify({
                    ...data,
                })}`,
                undefined,
                'get',
                option,
            );
        }
        return await this.HandleUser(`/${userId}/notifications`, { ...data }, 'get');
    };
}

const userAPI = new UserAPI();

export default userAPI;
