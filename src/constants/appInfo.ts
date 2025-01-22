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
    // base_url: 'http://192.168.1.130:3000/api/v1',
    // base_view_url: 'http://192.168.1.130:3000/views',

    base_url: 'https://nckhserver.duydemo.io.vn/api/v1',
    base_view_url: 'https://nckhserver.duydemo.io.vn/views',
});
