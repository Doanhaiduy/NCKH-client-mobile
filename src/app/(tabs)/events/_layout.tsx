import { colors } from '@/constants/colors';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function DetailsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: colors.white,
                },
                presentation: 'modal',
            }}
        >
            <Stack.Screen name="[id]" />
        </Stack>
    );
}

const styles = StyleSheet.create({});
