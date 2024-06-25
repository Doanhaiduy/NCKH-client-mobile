import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function EventLayout() {
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

const styles = StyleSheet.create({});
