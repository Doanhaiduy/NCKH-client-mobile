import { appInfo } from '@/constants/appInfo';
import { logout, updateAccessToken } from '@/stores/reducers/authReducer';
import store from '@/stores/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import queryString from 'query-string';
import { Alert } from 'react-native';

const getAccessToken = async () => {
    const res = await AsyncStorage.getItem('auth');
    return res ? JSON.parse(res).accessToken : '';
};

const HandleExpiredToken = async () => {
    await AsyncStorage.removeItem('auth');
    Alert.alert('Token expired!!', 'Your token has expired, please login again', [
        {
            text: 'OK',
            onPress: () => {
                router.navigate('/sign-in');
            },
        },
    ]);
};

const handleRefreshToken = async () => {
    try {
        const authStorage = await AsyncStorage.getItem('auth');
        const refreshToken = authStorage && JSON.parse(authStorage).refreshToken;

        if (!refreshToken) {
            HandleExpiredToken();
            return null;
        }
        const res = await axios.post(`${appInfo.base_url}/auth/refresh-token`, null, {
            headers: {
                token: `Bearer ${refreshToken}`,
            },
        });
        if (res.data.data.accessToken) {
            await AsyncStorage.setItem('auth', JSON.stringify(res.data.data.accessToken));
            return res.data.data.accessToken;
        }
        HandleExpiredToken();
        return null;
    } catch (error) {
        HandleExpiredToken();
        return null;
    }
};

const axiosClient = axios.create({
    paramsSerializer: (params) => queryString.stringify(params),
    timeout: 10000,
});

axiosClient.interceptors.request.use(async (config: any) => {
    const accessToken = await getAccessToken();
    config.headers = {
        Accept: 'application/json',
        ...config.headers,
    };
    if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;
    config.data;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        if ((response.status === 200 || response.status === 201) && response.data) {
            return response.data.data;
        }
        throw new Error('Something went wrong');
    },
    async (error) => {
        console.log('error ~ 1 ', error);
        if (error.response && error.response.status === 401) {
            const newAccessToken = await handleRefreshToken();
            if (newAccessToken) {
                const config = error.config;
                store.dispatch(updateAccessToken(newAccessToken));
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosClient.request(config);
            }
        }

        throw error?.response?.data?.message || error.message;
    },
);

export default axiosClient;
