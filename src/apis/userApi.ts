import { appInfo } from '@/constants/appInfo';
import axiosClient from './index';

class UserAPI {
    HandleUser = async (url: string, data?: any, method?: 'get' | 'post' | 'put' | 'delete') => {
        return await axiosClient(`${appInfo.BASE_URL}/users${url}`, {
            method: method || 'get',
            data,
            headers: {
                'content-type': 'multipart/form-data',
            },
            // onUploadProgress: (progressEvent) => {
            //     console.log('====================================');
            //     console.log(progressEvent);
            //     console.log('====================================');
            // },
        });
    };
}

const userAPI = new UserAPI();

export default userAPI;
