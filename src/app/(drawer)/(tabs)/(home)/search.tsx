import { ContainerComponent } from '@/components';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function SearchPage() {
    return (
        <ContainerComponent title="Tìm kiếm" iconLeft="back">
            <Text>SearchPage</Text>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
