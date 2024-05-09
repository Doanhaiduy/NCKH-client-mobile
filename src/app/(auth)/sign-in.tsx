import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { ContainerComponent, InputComponent, SpaceComponent } from '@/components';

export default function LoginPage() {
    const [value, setValue] = React.useState('');

    return (
        <ContainerComponent
            isAuth
            back
            title='Login Page'
            icon={<Ionicons name='search' size={24} color={colors['primary-400']} />}
        >
            <StatusBar style='auto' />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
