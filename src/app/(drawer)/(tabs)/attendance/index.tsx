import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

export default function Attendance() {
    return (
        <View>
            <Text>attendance index</Text>
            <Link href={'/attendance/scan'}> to scan</Link>
            <Link href={'/attendance/pending'}> to pending</Link>
            <Link href={'/attendance/attended'}> to attended</Link>
            <Link href={'/attendance/id12'}> to id12</Link>
        </View>
    );
}

const styles = StyleSheet.create({});
