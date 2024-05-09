import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

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
        <Stack>
            <Stack.Screen
                name='index'
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='(drawer)'
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name='(auth)'
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({});
