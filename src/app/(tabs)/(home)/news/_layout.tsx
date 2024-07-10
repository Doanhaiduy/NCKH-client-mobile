import { colors } from '@/constants/colors';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function EventLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: colors.white,
                },
            }}
        >
            <Stack.Screen
                name="details"
                options={{
                    presentation: 'fullScreenModal',
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({});
