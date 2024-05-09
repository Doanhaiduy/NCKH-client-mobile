import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';
import ContainerComponent from '@/components/ContainerComponent';

export default function VerificationPage() {
    return (
        <ContainerComponent isAuth isScroll isModal back>
            <Stack.Screen
                options={{
                    presentation: 'modal',
                }}
            />
            <Text>VerificationPage</Text>
            <Link href={'/set-password'}>NEXT</Link>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
