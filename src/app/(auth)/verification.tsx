import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

export default function VerificationPage() {
    return (
        <View>
            <Stack.Screen
                options={{
                    presentation: 'modal',
                }}
            />
            <Text>VerificationPage</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
