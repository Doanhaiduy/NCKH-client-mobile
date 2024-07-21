import { AxiosRequestConfig } from 'axios';
import axiosClient from './index';

class PostAPI {
    HandlePost = async (
        url: string,
        data?: any,
        method?: 'get' | 'post' | 'put' | 'delete',
        options: AxiosRequestConfig = {},
    ): Promise<Posts> => {
        return await axiosClient(`${process.env.EXPO_PUBLIC_BASE_URL}/posts${url}`, {
            method: method || 'get',
            data: method !== 'get' ? undefined : data,
            params: method === 'get' ? data : undefined,
            ...options,
        });
    };

    getPosts = async (data: PostParams, option: AxiosRequestConfig = {}): Promise<Posts> => {
        return await this.HandlePost('/get-all', data, 'get', option);
    };
}

const postAPI = new PostAPI();

export default postAPI;
