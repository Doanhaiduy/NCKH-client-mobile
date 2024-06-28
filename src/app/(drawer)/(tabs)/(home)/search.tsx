import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ContainerComponent } from '@/components';
import { Stack, Tabs } from 'expo-router';

export default function SearchPage() {
    return (
        <ContainerComponent title="Tìm kiếm" iconLeft="back">
            <Text>SearchPage</Text>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
