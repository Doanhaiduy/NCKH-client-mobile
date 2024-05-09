import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

export default function SetPassword() {
    return (
        <View>
            <Stack.Screen
                options={{
                    presentation: 'modal',
                }}
            />
            <Text>SetPassword</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
