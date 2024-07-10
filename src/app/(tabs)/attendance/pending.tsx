import { ContainerComponent } from '@/components';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function Pending() {
    return (
        <ContainerComponent iconLeft="logo" title="Pending" isScroll>
            <Text>Pending</Text>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
