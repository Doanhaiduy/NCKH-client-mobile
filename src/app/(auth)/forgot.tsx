import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';

export default function ForGotPassWord() {
    return (
        <View>
            <Stack.Screen />
            <Text>forGotPassWord</Text>
            <Link href={'/set-password'}>go to set-password</Link>
        </View>
    );
}

const styles = StyleSheet.create({});
