import { TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { authSelector } from '@/stores/reducers/authReducer';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router, Tabs, usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
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
                    display: path === '/attendance/scan' || path === '/chat' ? 'none' : 'flex',
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
                    tabBarIcon: ({}) => (
                        <View className='items-center justify-center'>
                            <View className='p-2 bg-white rounded-full items-center justify-center h-18 w-18 -mt-12'>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    className='items-center justify-center h-16 w-16 bg-primary-500'
                                    style={{
                                        borderRadius: 100,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 3,
                                        elevation: 4,
                                    }}
                                    onPress={() => {
                                        router.navigate('/attendance');
                                    }}
                                >
                                    <MaterialIcons name='qr-code-scanner' size={36} color={colors.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ),
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
