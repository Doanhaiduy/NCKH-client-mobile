import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name='index'
                options={{
                    headerTitle: 'Home Page',
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                options={{
                    headerTitle: 'User Page',
                    title: 'User',
                }}
                name='users/[id]'
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({});
