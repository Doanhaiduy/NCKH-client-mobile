import { Link, Redirect } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
    return <Redirect href={'/(home)'} />;
    return (
        <View className="flex items-center justify-center h-screen">
            <Link href={'/sign-in'}>go to sign-in</Link>
            <Link href={'/verification'}>go to verification</Link>
            <Link href={'/set-password'}>go to set-password</Link>
            <Link href={'/forgot'}>go to forgot</Link>
            <Text>Home root</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
