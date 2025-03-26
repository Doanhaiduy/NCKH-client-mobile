if (__DEV__) {
    require('../../ReactotronConfig');
}
import store from '@/stores/store';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, LogBox, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useDispatch } from 'react-redux';
import '../../global.css';
import { Host } from 'react-native-portalize';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuth } from '@/stores/reducers/authReducer';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';

// Block "react-native-render-html" error log
LogBox.ignoreLogs(['Use JavaScript default parameters instead.']);

// This is the default configuration
configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
});

SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
            refetchOnMount: false,
            refetchOnReconnect: true,
            retry: 3,
            staleTime: 1000 * 60 * 1,
        },
    },
});

export const unstable_settings = {
    initialRouteName: '/',
};

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Inter: Inter_400Regular,
        InterMd: Inter_500Medium,
        InterSemi: Inter_600SemiBold,
        PoppinsSemi: Poppins_600SemiBold,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <RootLayoutNav />
                </I18nextProvider>
            </Provider>
        </QueryClientProvider>
    );
}

function RootLayoutNav() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const auth = await AsyncStorage.getItem('auth');
                if (auth) {
                    const authData = JSON.parse(auth);
                    dispatch(setAuth(authData));
                }
            } catch (error) {
                console.error('Failed to load auth data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAuthData();
    }, [dispatch]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' />
            </View>
        );
    }

    return (
        <GestureHandlerRootView className='flex-1 bg-white'>
            <Host>
                <Slot />
            </Host>
        </GestureHandlerRootView>
    );
}
