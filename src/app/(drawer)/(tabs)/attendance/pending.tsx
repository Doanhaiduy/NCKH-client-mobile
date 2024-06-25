import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ContainerComponent } from '@/components';

export default function Pending() {
    return (
        <ContainerComponent iconLeft='menu' title='Pending' isScroll>
            <Text>Pending</Text>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
