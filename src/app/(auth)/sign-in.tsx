import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import ContainerComponent from '@/components/ContainerComponent';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';

export default function LoginPage() {
    return (
        <ContainerComponent
            back
            isScroll
            title="Login Page"
            icon={<Ionicons name="search" size={24} color={colors['primary-400']} />}
        >
            <StatusBar style="auto" />
            <Stack.Screen />
            <Text className="font-sans">LoginPage</Text>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
