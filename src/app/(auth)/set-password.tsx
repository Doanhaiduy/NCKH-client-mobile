import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, Stack, router } from 'expo-router';
import ContainerComponent from '@/components/ContainerComponent';

export default function SetPassword() {
    return (
        <ContainerComponent isAuth isScroll isModal back>
            <Stack.Screen
                options={{
                    presentation: 'modal',
                }}
            />
            <Text>SetPassword</Text>
            <Pressable onPress={() => router.dismissAll()}>
                <Text>ok</Text>
            </Pressable>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
