import { Stack } from 'expo-router';
import React from 'react';

export default function AttendanceLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name='index' />
            <Stack.Screen
                name='scan'
                options={{
                    presentation: 'containedModal',
                }}
            />
            <Stack.Screen name='pending' />
            <Stack.Screen name='list' />

            <Stack.Screen name='[id]' />
        </Stack>
    );
}
