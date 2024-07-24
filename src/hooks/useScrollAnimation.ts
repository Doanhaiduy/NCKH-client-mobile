import { appInfo } from '@/constants/appInfo';
import { useHeaderHeight } from '@/contexts/HeaderHeightContext';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export default function useScrollAnimation() {
    const { setHeaderHeight } = useHeaderHeight();

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY > 40) {
            setHeaderHeight(appInfo.headerHeight.onScroll);
        } else {
            setHeaderHeight(appInfo.headerHeight.default);
        }
    };

    return { handleScroll };
}
