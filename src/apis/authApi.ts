import axiosClient from './index';

class AuthAPI {
    HandleAuth = async (url: string, data?: any, method?: 'get' | 'post' | 'put' | 'delete') => {
        return await axiosClient(`${process.env.EXPO_PUBLIC_BASE_URL}/auth${url}`, {
            method: method || 'get',
            data,
        });
    };
}

const authAPI = new AuthAPI();

export default authAPI;
