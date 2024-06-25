import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Slot, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import store from '@/stores/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    initialRouteName: '(auth)',
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
        <Provider store={store}>
            <GestureHandlerRootView className='flex-1'>
                <Slot />
            </GestureHandlerRootView>
        </Provider>
    );
}

const styles = StyleSheet.create({});
