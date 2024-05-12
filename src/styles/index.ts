import { Platform } from 'react-native';

export const globalStyles = {
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
};
