import { Link, Redirect } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
    return <Redirect href={'/sign-in'} />;
}

const styles = StyleSheet.create({});
