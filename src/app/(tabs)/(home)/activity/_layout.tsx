import { colors } from '@/constants/colors';
import { Stack } from 'expo-router';
import React from 'react';

export default function ActivityLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: colors.white,
                },
            }}
        />
    );
}
