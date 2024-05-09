import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="forgot" />
            <Stack.Screen name="send-otp" />
            <Stack.Screen
                name="verification"
                options={{
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="set-password"
                options={{
                    presentation: 'modal',
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({});
