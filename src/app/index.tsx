import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, router, SplashScreen } from 'expo-router';

export default function Home() {
    return (
        <View className="flex items-center justify-center h-screen">
            <Link href={'/send-otp'}>go to otp</Link>
            <Link href={'/sign-in'}>go to sign-in</Link>
            <Link href={'/verification'}>go to verification</Link>
            <Link href={'/set-password'}>go to set-password</Link>
            <Link href={'/forgot'}>go to forgot</Link>
            <Link href={'(drawer)'}>go to drawer</Link>
            <Text>Home root</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
