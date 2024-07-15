import { Dimensions, Platform } from 'react-native';

export const appInfo = {
    sizes: {
        WIDTH: Dimensions.get('window').width,
        HEIGHT: Dimensions.get('window').height,
    },
    headerHomeBar: Platform.OS === 'android' ? 130 : 150,
    BASE_URL: 'http://192.168.1.18:3000/api/v1',
};
