import { Dimensions, Platform } from 'react-native';

export const appInfo = Object.freeze({
    sizes: {
        WIDTH: Dimensions.get('window').width,
        HEIGHT: Dimensions.get('window').height,
    },
    headerHomeBar: 0,
    headerHeight: {
        default: Platform.OS === 'android' ? 122 : 150,
        onScroll: Platform.OS === 'android' ? 80 : 102,
    },
});
