import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';
import { ContainerComponent } from '@/components';

export default function ForGotPassWord() {
    return (
        <ContainerComponent isAuth isScroll>
            <Stack.Screen />
            <Text>forGotPassWord</Text>
            <Link href={'/set-password'}>go to set-password</Link>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
