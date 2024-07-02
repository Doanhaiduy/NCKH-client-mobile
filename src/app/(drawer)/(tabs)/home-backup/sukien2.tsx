import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { appInfo } from '@/constants/appInfo';

export default function SuKien2() {
    return (
        <View
            style={{
                marginTop: appInfo.headerHomeBar,
            }}
        >
            <Text>SuKien2</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
