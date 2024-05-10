import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

export default function AttendanceLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name='attended' />
            <Stack.Screen name='scan' />
            <Stack.Screen name='[id]' />
            <Stack.Screen name='pending' />
        </Stack>
    );
}

const styles = StyleSheet.create({});
