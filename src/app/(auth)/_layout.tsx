import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="forgot" />
            <Stack.Screen name="verification" />
            <Stack.Screen name="set-password" />
        </Stack>
    );
}

const styles = StyleSheet.create({});
