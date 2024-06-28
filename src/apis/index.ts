import axios from 'axios';
import queryString from 'query-string';

// const getAccessToken = async () => {
//     const res = await AsyncStorage.getItem('auth');
//     return res ? JSON.parse(res).accessToken : '';
// };

// const HandleExpiredToken = async () => {
//     await AsyncStorage.setItem(
//         'auth',
//         JSON.stringify({
//             accessToken: 'TokenExpired',
//         })
//     );

//     Alert.alert('Token expired!!', 'Your token has expired, please login again', [
//         {
//             text: 'OK',
//             onPress: () => router.navigate('/login'),
//         },
//     ]);
// };

const axiosClient = axios.create({
    paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
    // const accessToken = await getAccessToken();
    // console.log(`Bearer ${accessToken}`);
    config.headers = {
        // Authorization: accessToken ? `Bearer ${accessToken}` : '',
        Accept: 'application/json',
        ...config.headers,
    };
    config.data;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        if (
            (response.status === 200 || response.status === 201) &&
            response.data &&
            response.data.status === 'success'
        ) {
            return response.data;
        }
        throw new Error('Something went wrong');
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // HandleExpiredToken();
            console.log('Token expired');
        }
        throw error.response.data.message || error.message;
    },
);

export default axiosClient;
