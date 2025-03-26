import { Stack } from 'expo-router';
import React from 'react';

export default function SettingHelpsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name='index' />
            <Stack.Screen name='user-guide' />
            <Stack.Screen name='terms-policies' />
            <Stack.Screen
                name='[id]'
                options={{
                    presentation: 'fullScreenModal',
                }}
            />
        </Stack>
    );
}
