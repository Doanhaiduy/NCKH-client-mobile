import { Platform } from 'react-native';

export const globalStyles: any = {
    shadow: {
        shadowColor: Platform.OS === 'ios' ? 'rgba(19, 19, 19, 0.2)' : 'rgba(19, 19, 19, 0.2)',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    centerAbsolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
};
