import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

export default function Home() {
    return (
        <View>
            <Link href={'/'}> back to root</Link>
            <Text>Home index</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
