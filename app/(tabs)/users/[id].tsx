import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';

export default function UserPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return (
        <View>
            <Pressable onPress={() => router.back()}>
                <Text>back</Text>
            </Pressable>
            <Text>UserPage {id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
