// chatApi.ts
import { AxiosRequestConfig } from 'axios';
import axiosClient from './index';
import { appInfo } from '@/constants/appInfo';

class ChatAPI {
    HandleChat = async <T>(
        url: string,
        data?: any,
        method?: 'get' | 'post' | 'delete',
        options: AxiosRequestConfig = {},
    ): Promise<T> => {
        return await axiosClient(`${appInfo.base_url}/chat${url}`, {
            method: method || 'get',
            data,
            ...options,
        });
    };

    getChatHistory = async (
        data: {
            page?: number;
            size?: number;
        },
        option: AxiosRequestConfig = {},
    ): Promise<{
        messages: Message[];
        totalMessages: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    }> => {
        return await this.HandleChat(`/history?page=${data.page || 1}&size=${data.size || 10}`, undefined, 'get', {
            headers: {
                'Content-Type': 'application/json',
            },
            ...option,
        });
    };

    sendMessage = async (
        data: {
            message: string;
            mode?: 'data' | 'conversation';
        },
        option: AxiosRequestConfig = {},
    ): Promise<{ response: string }> => {
        return await this.HandleChat('/send-message', data, 'post', {
            headers: {
                'Content-Type': 'application/json',
            },
            ...option,
        });
    };

    clearChatHistory = async (option: AxiosRequestConfig = {}): Promise<any> => {
        return await this.HandleChat('/clear-history', undefined, 'delete', option);
    };
}

const chatAPI = new ChatAPI();

export default chatAPI;
