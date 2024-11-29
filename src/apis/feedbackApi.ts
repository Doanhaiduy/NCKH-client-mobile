import { AxiosRequestConfig } from 'axios';
import axiosClient from './index';
import { appInfo } from '@/constants/appInfo';

class FeedbackAPI {
    HandleFeedback = async <T>(
        url: string,
        data?: any,
        method?: 'get' | 'post' | 'put' | 'delete',
        options: AxiosRequestConfig = {},
    ): Promise<T> => {
        return await axiosClient(`${appInfo.base_url}/feedbacks${url}`, {
            method: method || 'get',
            data,
            params: method === 'get' ? data : undefined,
            ...options,
        });
    };

    submitFeedback = async (data: FeedbackParams, option: AxiosRequestConfig = {}): Promise<Feedback> => {
        return await this.HandleFeedback('/', data, 'post', option);
    };
}

const feedbackAPI = new FeedbackAPI();

export default feedbackAPI;
