import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ContainerComponent } from '@/components';

export default function Support() {
    return (
        <ContainerComponent isModal iconLeft="back" title="Hỗ trợ khách hàng">
            <Text>Support</Text>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
