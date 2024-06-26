import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ContainerComponent } from '@/components';
import { Stack } from 'expo-router';

export default function ReportIssue() {
    return (
        <ContainerComponent isModal>
            <Text>ReportIssue</Text>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
