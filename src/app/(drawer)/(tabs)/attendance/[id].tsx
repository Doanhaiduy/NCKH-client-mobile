import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function Details() {
    const { id, te } = useLocalSearchParams();
    console.log(id, te);
    return (
        <View>
            <Stack.Screen options={{ headerTitle: 'Details Page ' + id, title: 'Details ' + id }} />
            <Text>Details {id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
