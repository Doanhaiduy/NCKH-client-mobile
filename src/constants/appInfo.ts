import { Dimensions, Platform, StatusBar } from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height, width } = Dimensions.get('window');

const isIPhoneX = () =>
    Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV
        ? (width === X_WIDTH && height === X_HEIGHT) || (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
        : false;

export const appInfo = Object.freeze({
    sizes: {
        WIDTH: Dimensions.get('window').width,
        HEIGHT: Dimensions.get('window').height,
    },
    StatusBarHeight: Platform.select({
        ios: isIPhoneX() ? 44 : 20,
        android: StatusBar.currentHeight,
        default: 0,
    }),
    // base_url: 'http:/192.168.1.20:3000/api/v1',
    // base_view_url: 'http:/192.168.1.20:3000/views',
    base_url: 'https://nckhserver.duydemo.io.vn/api/v1',
    base_view_url: 'https://nckhserver.duydemo.io.vn/views',
});
