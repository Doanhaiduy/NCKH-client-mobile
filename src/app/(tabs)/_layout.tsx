import { TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { authSelector } from '@/stores/reducers/authReducer';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router, Tabs, usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function TabsLayout() {
    const path = usePathname();
    const { authData } = useSelector(authSelector);

    useEffect(() => {
        if (!authData || !authData.accessToken) {
            setTimeout(() => {
                router.navigate('/(auth)/sign-in');
            }, 100);
        }
    }, [authData]);

    return (
        <Tabs
            initialRouteName='(home)'
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
                    display: path === '/attendance/scan' ? 'none' : 'flex',
                },
                tabBarActiveTintColor: colors.primary400,
            }}
        >
            <Tabs.Screen
                name='(home)'
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View className='items-center min-w-[70px]'>
                            <Feather name='home' size={20} color={color} />
                            <TextComponent text='Trang chủ' color={color} size={10} />
                        </View>
                    ),
                    headerTitle: 'Trang chủ',
                    title: '',
                }}
            />
            <Tabs.Screen
                name='notification'
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View className='items-center min-w-[70px]'>
                            <Feather name='bell' size={20} color={color} />
                            <TextComponent text='Thông báo' color={color} size={10} />
                        </View>
                    ),
                    headerTitle: 'Thông báo',
                    title: '',
                }}
            />
            <Tabs.Screen
                name='attendance'
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <TouchableOpacity
                            activeOpacity={0.3}
                            className='items-center justify-center h-14 w-14  bg-primary-400 mb-10'
                            style={{
                                borderRadius: 99,
                            }}
                            onPress={() => {
                                router.navigate('/attendance');
                            }}
                        >
                            <MaterialIcons name='qr-code-scanner' size={26} color={colors.white} />
                        </TouchableOpacity>
                    ),
                    headerTitle: 'Điểm danh',
                    title: '',
                }}
            />
            <Tabs.Screen
                name='feedback'
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View className='items-center min-w-[70px]'>
                            <MaterialCommunityIcons name='message-processing-outline' size={20} color={color} />
                            <TextComponent text='Góp ý' color={color} size={10} />
                        </View>
                    ),
                    title: '',
                    headerTitle: 'Góp ý',
                }}
            />
            <Tabs.Screen
                name='setting'
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View className='items-center min-w-[70px]'>
                            <Feather name='user' size={20} color={color} />
                            <TextComponent text='Cài đặt' color={color} size={10} />
                        </View>
                    ),
                    headerTitle: 'Cài đặt',
                    title: '',
                }}
            />

            <Tabs.Screen
                name='training-point'
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({});
