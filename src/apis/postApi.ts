import { AxiosRequestConfig } from 'axios';
import axiosClient from './index';
import { API_URL } from '@/constants/apiUrl';
import QueryString from 'qs';
import { Platform } from 'react-native';

class PostAPI {
    HandlePost = async <T>(
        url: string,
        data?: any,
        method?: 'get' | 'post' | 'put' | 'delete',
        options: AxiosRequestConfig = {},
    ): Promise<T> => {
        return await axiosClient(`${process.env.EXPO_PUBLIC_BASE_URL}/posts${url}`, {
            method: method || 'get',
            data,
            params: method === 'get' ? data : undefined,
            ...options,
        });
    };

    getPosts = async (data?: PostsParams, option: AxiosRequestConfig = {}): Promise<Posts> => {
        if (Platform.OS === 'ios') {
            return await this.HandlePost(
                `${API_URL.post.getPosts}?${QueryString.stringify({
                    ...data,
                })}`,
                undefined,
                'get',
                option,
            );
        }

        return await this.HandlePost(
            `${API_URL.post.getPosts}`,
            {
                ...data,
            },
            'get',
        );
    };

    getDetailPost = async (id: string, option: AxiosRequestConfig = {}): Promise<PostDetails> => {
        return await this.HandlePost(`/${id}`, undefined, 'get', option);
    };
}

const postAPI = new PostAPI();

export default postAPI;
