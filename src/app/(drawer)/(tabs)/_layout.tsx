import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="(home)"
                options={{
                    headerTitle: 'Trang chủ',
                    title: 'Trang chủ',
                }}
            />
            <Tabs.Screen
                name="attendance"
                options={{
                    headerTitle: 'Điểm danh',
                    title: 'Điểm danh',
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    headerTitle: 'Thông báo',
                    title: 'Thông báo',
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    headerTitle: 'Cài đặt',
                    title: 'Cài đặt',
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({});
