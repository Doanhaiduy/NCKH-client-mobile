import { appInfo } from '@/constants/appInfo';
import { updateToken } from '@/stores/reducers/authReducer';
import store from '@/stores/store';
import i18n from '@/utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import queryString from 'query-string';
import { Alert } from 'react-native';

const getAccessToken = async () => {
    const res = await AsyncStorage.getItem('auth');
    return res ? JSON.parse(res).accessToken : '';
};

let alertShown = false;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
    refreshSubscribers.map((callback) => callback(token));
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

const HandleExpiredToken = async () => {
    if (!alertShown) {
        alertShown = true;

        await AsyncStorage.removeItem('auth');

        Alert.alert('Phiên đã hết hạn!!', 'Vui lòng đăng nhập lại', [
            {
                text: 'OK',
                onPress: () => {
                    alertShown = false;
                    router.navigate('/sign-in');
                },
            },
        ]);
    }
};

const handleRefreshToken = async () => {
    if (isRefreshing) {
        return new Promise<string>((resolve) => {
            addRefreshSubscriber((token) => {
                resolve(token);
            });
        });
    }

    isRefreshing = true;

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
            await AsyncStorage.setItem('auth', JSON.stringify(res.data.data));
            store.dispatch(
                updateToken({
                    newAccessToken: res.data.data.accessToken,
                    newRefreshToken: res.data.data.refreshToken,
                }),
            );
            onRefreshed(res.data.data.accessToken);
            return res.data.data.accessToken;
        }
        HandleExpiredToken();
        return null;
    } catch (error) {
        HandleExpiredToken();
        return null;
    } finally {
        isRefreshing = false;
        refreshSubscribers = [];
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
        // add language
        'Accept-Language': i18n.language,
        'Content-Language': i18n.language,
    };
    if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;
    config.data;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response.status === 200 && response.data.result) {
            return response.data.result;
        } else {
            if ((response.status === 200 || response.status === 201) && response.data) {
                return response.data.data;
            }
            throw new Error('Something went wrong');
        }
    },
    async (error) => {
        console.log('error ~ 1 ', error);
        const { config, response } = error;
        if (response && response.status === 401) {
            const newAccessToken = await handleRefreshToken();
            if (newAccessToken) {
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosClient.request(config);
            }
        }

        throw error?.response?.data?.message || error.message;
    },
);

export default axiosClient;
