import axiosClient from './index';

class UserAPI {
    HandleUser = async (url: string, data?: any, method?: 'get' | 'post' | 'put' | 'delete') => {
        return await axiosClient(`${process.env.EXPO_PUBLIC_BASE_URL}/users${url}`, {
            method: method || 'get',
            data,
            headers: {
                'content-type': 'multipart/form-data',
            },
        });
    };
}

const userAPI = new UserAPI();

export default userAPI;
