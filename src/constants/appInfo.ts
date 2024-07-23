import { Dimensions, Platform } from 'react-native';

export const appInfo = Object.freeze({
    sizes: {
        WIDTH: Dimensions.get('window').width,
        HEIGHT: Dimensions.get('window').height,
    },
    headerHomeBar: 0,
});
