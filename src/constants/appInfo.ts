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
    base_url: __DEV__ ? 'http://192.168.1.15:3000/api/v1' : 'https://nckhserver.duydemo.io.vn/api/v1',
    base_view_url: __DEV__ ? 'http://192.168.1.15:3000/views' : 'https://nckhserver.duydemo.io.vn/views',
    base_url_face_detect: 'https://nckhface.duydemo.io.vn',
});
