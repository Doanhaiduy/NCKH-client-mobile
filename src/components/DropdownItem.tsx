import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import TextComponent from './TextComponent';

const Items = [
    {
        name: 'Đã đăng ký',
        route: '/event1/',
    },
    {
        name: 'Đang diễn ra',
        route: '/event2/',
    },
    {
        name: 'Đã diễn ra',
        route: '/event3/',
    },
];

export default function DropdownItem() {
    return (
        <View className='px-4'>
            <View className='flex-row items-center gap-2'>
                <AntDesign name='solution1' size={24} color='black' />
                <TextComponent className='text-base' text='Hoạt động ngoại khóa' />
            </View>
            <View className='pl-3 mt-2 w-[600px]'>
                {Items.map((item, index) => (
                    <DrawerItem
                        labelStyle={{
                            width: 600,
                            marginLeft: -20,
                            fontSize: 16,
                            fontWeight: 'normal',
                            fontFamily: 'Inter',
                        }}
                        key={index}
                        icon={({ color, size }) => <Ionicons name='chevron-forward' color={colors.text400} />}
                        label={item.name}
                        onPress={() =>
                            router.push({
                                pathname: item.route,
                                params: {
                                    typeName: item.name,
                                },
                            })
                        }
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
