import { AxiosRequestConfig } from 'axios';
import axiosClient from './index';
import { API_URL } from '@/constants/apiUrl';
import QueryString from 'qs';
import { Platform } from 'react-native';
import { appInfo } from '@/constants/appInfo';

class EventAPI {
    HandleEvent = async <T>(
        url: string,
        data?: any,
        method?: 'get' | 'post' | 'put' | 'delete',
        options: AxiosRequestConfig = {},
    ): Promise<T> => {
        return await axiosClient(`${appInfo.base_url}/events${url}`, {
            method: method || 'get',
            data,
            params: method === 'get' ? data : undefined,
            ...options,
        });
    };

    getEvents = async (data?: EventsParams, option: AxiosRequestConfig = {}): Promise<Events> => {
        if (Platform.OS === 'ios') {
            return await this.HandleEvent(
                `${API_URL.event.getEvents}?${QueryString.stringify({
                    ...data,
                })}`,
                undefined,
                'get',
                option,
            );
        }

        return await this.HandleEvent(
            `${API_URL.event.getEvents}`,
            {
                ...data,
            },
            'get',
        );
    };

    getDetailEvents = async (id: string, option: AxiosRequestConfig = {}): Promise<EventDetails> => {
        return await this.HandleEvent(`/${id}`, undefined, 'get', option);
    };

    checkInEvent = async (
        data: EventCheckInParams,
        eventId: string,
        option: AxiosRequestConfig = {},
    ): Promise<AttendanceDetails> => {
        return await this.HandleEvent(`/${eventId}/check-in`, data, 'post', option);
    };
}

const eventAPI = new EventAPI();

export default eventAPI;
