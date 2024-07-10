import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function TabsLayout() {
    return (
        <Tabs
            initialRouteName="(home)"
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="home" size={24} color={color} />,
                    headerTitle: 'Trang chủ',
                    title: 'Trang chủ',
                }}
            />
            <Tabs.Screen
                name="attendance"
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="check-square" size={24} color={color} />,
                    headerTitle: 'Điểm danh',
                    title: 'Điểm danh',
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="bell" size={24} color={color} />,
                    headerTitle: 'Thông báo',
                    title: 'Thông báo',
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="user" size={24} color={color} />,
                    headerTitle: 'Cài đặt',
                    title: 'Cài đặt',
                }}
            />
            <Tabs.Screen
                name="training-point"
                options={{
                    href: null,
                }}
            />
            {/* <Tabs.Screen
                name='search'
                options={{
                    href: null,
                }}
            /> */}
        </Tabs>
    );
}

const styles = StyleSheet.create({});
