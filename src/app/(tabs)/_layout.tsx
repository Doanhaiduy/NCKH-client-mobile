import { TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabsLayout() {
    return (
        <Tabs
            initialRouteName="(home)"
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                headerBackgroundContainerStyle: {
                    backgroundColor: '#fff',
                },
                tabBarStyle: {
                    elevation: 0,
                    backgroundColor: '#fff',
                    paddingTop: 15,
                    height: Platform.OS === 'ios' ? 80 : 60,
                },
            }}
            sceneContainerStyle={{
                backgroundColor: '#fff',
            }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View className="items-center ">
                            <Feather name="home" size={20} color={color} />
                            <TextComponent text="Trang chủ" color={color} size={10} />
                        </View>
                    ),
                    headerTitle: 'Trang chủ',
                    title: '',
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View className="items-center ">
                            <Feather name="bell" size={20} color={color} />
                            <TextComponent text="Thông báo" color={color} size={10} />
                        </View>
                    ),
                    headerTitle: 'Thông báo',
                    title: '',
                }}
            />
            <Tabs.Screen
                name="attendance"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View className="items-center justify-center h-14 w-14 rounded-full bg-primary-400 mb-10">
                            <MaterialIcons name="qr-code-scanner" size={26} color={colors.white} />
                        </View>
                    ),
                    headerTitle: 'Điểm danh',
                    title: '',
                }}
            />
            <Tabs.Screen
                name="feedback"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View className="items-center ">
                            <MaterialCommunityIcons name="message-processing-outline" size={20} color={color} />
                            <TextComponent text="Góp ý" color={color} size={10} />
                        </View>
                    ),
                    title: '',
                    headerTitle: 'Góp ý',
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View className="items-center ">
                            <Feather name="user" size={20} color={color} />
                            <TextComponent text="Cài đặt" color={color} size={10} />
                        </View>
                    ),
                    headerTitle: 'Cài đặt',
                    title: '',
                }}
            />

            <Tabs.Screen
                name="training-point"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="events"
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
