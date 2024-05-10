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
            <Stack.Screen name='sign-in' />
            <Stack.Screen name='forgot' />
            <Stack.Screen name='verification' />
            <Stack.Screen name='set-password' />
        </Stack>
    );
}

const styles = StyleSheet.create({});
