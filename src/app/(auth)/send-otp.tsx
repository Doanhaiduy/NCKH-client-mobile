import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';
import ContainerComponent from '@/components/ContainerComponent';
import { Ionicons } from '@expo/vector-icons';

export default function SendOTPPage() {
    return (
        <ContainerComponent title='Send OTP' isScroll back isAuth isModal>
            <Text>SendOTPPage</Text>
            <Link href={'/verification'}>NEXT</Link>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
