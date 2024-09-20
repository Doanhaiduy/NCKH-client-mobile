import store from '@/stores/store';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import '../../global.css';
import { Host } from 'react-native-portalize';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: 5 * 60 * 1000,
        },
    },
});

export const unstable_settings = {
    initialRouteName: '',
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

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <GestureHandlerRootView className="flex-1 bg-white">
                    <Host>
                        <Slot />
                    </Host>
                </GestureHandlerRootView>
            </Provider>
        </QueryClientProvider>
    );
}
// <ReactQueryDevtools initialIsOpen={true} />

const styles = StyleSheet.create({});
