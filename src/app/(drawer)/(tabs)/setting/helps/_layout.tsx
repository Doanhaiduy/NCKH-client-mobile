import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function SettingHelpsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen
                name="user-guide"
                options={{
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="faq"
                options={{
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="support"
                options={{
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="report-issue"
                options={{
                    presentation: 'modal',
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({});
