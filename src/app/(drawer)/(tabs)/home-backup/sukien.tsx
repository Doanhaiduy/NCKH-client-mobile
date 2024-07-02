import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { appInfo } from '@/constants/appInfo';

export default function SuKien() {
    return (
        <View
            style={{
                marginTop: appInfo.headerHomeBar,
            }}
        >
            <Text>SuKien</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
