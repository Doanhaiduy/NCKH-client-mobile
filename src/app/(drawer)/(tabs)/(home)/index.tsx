import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Tabs } from 'expo-router';
import { ContainerComponent } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

export default function Home() {
    return (
        <ContainerComponent
            isScroll
            title='Trang chủ'
            iconLeft='menu'
            iconRight={<Ionicons name='search' size={24} color={colors['primary-400']} />}
        >
            <Tabs />
            <Link href={'/'}> back to root</Link>
            <Text>Home index</Text>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
