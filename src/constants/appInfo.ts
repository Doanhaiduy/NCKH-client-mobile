import { Dimensions, Platform } from 'react-native';

export const appInfo = Object.freeze({
    sizes: {
        WIDTH: Dimensions.get('window').width,
        HEIGHT: Dimensions.get('window').height,
    },
    headerHomeBar: 0,
    headerHeight: {
        default: Platform.OS === 'android' ? 80 : 102,
        onScroll: Platform.OS === 'android' ? 80 : 102,
    },
    base_url: 'http://10.160.1.12:3000/api/v1',
});
