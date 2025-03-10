import { useRouter, useSegments, useNavigation, Router } from 'expo-router';
import { useRef, useEffect } from 'react';

interface NavigationHistory {
    path: string;
    timestamp: number;
}

interface NavigateOptions {
    replace?: boolean;
    params?: Record<string, any>;
}

export const useCustomRouter = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const segments = useSegments();
    const navigationHistoryRef = useRef<NavigationHistory[]>([]);
    const isNavigatingCrossTabs = useRef<boolean>(false);
    const getCurrentPath = (): string => {
        return '/' + segments.join('/');
    };

    useEffect(() => {
        const currentPath = getCurrentPath();

        if (!isNavigatingCrossTabs.current) {
            navigationHistoryRef.current.push({
                path: currentPath,
                timestamp: Date.now(),
            });
        } else {
            isNavigatingCrossTabs.current = false;
        }
    }, [segments]);

    const navigateTo = (route: string, options?: NavigateOptions): void => {
        const currentPath = getCurrentPath();

        const currentTab = segments.length > 0 ? segments[0] : '';
        const targetTab = route.split('/')[1];

        if (currentTab !== targetTab && currentTab !== '') {
            isNavigatingCrossTabs.current = true;

            navigationHistoryRef.current.push({
                path: currentPath,
                timestamp: Date.now(),
            });
        }

        if (options?.replace) {
            if (options.params) {
                router.replace({ pathname: route, params: options.params });
            } else {
                router.replace(route);
            }
        } else {
            if (options?.params) {
                router.push({ pathname: route, params: options.params });
            } else {
                router.push(route);
            }
        }
    };

    const goBack = (): void => {
        const history = navigationHistoryRef.current;

        if (history.length < 2) {
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                router.push('/(tabs)');
            }
            return;
        }

        history.pop();

        const previousEntry = history[history.length - 1];

        if (previousEntry) {
            router.replace(previousEntry.path);
            history.pop();
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            router.push('/(tabs)');
        }
    };

    const clearHistory = (): void => {
        navigationHistoryRef.current = [];
    };

    return {
        ...router,
        navigateTo,
        goBack,
        clearHistory,
        currentPath: getCurrentPath(),
    };
};
