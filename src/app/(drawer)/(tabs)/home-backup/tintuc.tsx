import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { appInfo } from '@/constants/appInfo';

export default function TinTuc() {
    return (
        <View
            style={{
                marginTop: appInfo.headerHomeBar,
            }}
        >
            <Text>TinTuc</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
