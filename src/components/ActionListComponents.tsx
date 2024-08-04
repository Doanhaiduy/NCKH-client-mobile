import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import TextComponent from './TextComponent';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';

const ActionData: {
    icon: string;
    text: string;
    path: string;
}[] = [
    {
        icon: 'check-to-slot',
        text: 'Đã đăng ký',
        path: 'Registered',
    },
    {
        icon: 'check-to-slot',
        text: 'Đã điểm danh',
        path: '/attendance/list',
    },
    {
        icon: 'check-to-slot',
        text: 'Điểm rèn luyện',
        path: '/training-point',
    },
    {
        icon: 'check-to-slot',
        text: 'Tài khoản',
        path: '/setting',
    },
];

const ActionCard = ({ text, icon, path }: { text: string; icon: string; path: string }) => {
    return (
        <TouchableOpacity
            className="items-center justify-center"
            onPress={() =>
                router.push({
                    pathname: path,
                })
            }
        >
            <View className="mb-2 w-[60px] h-[60px] items-center justify-center border-[1px] border-text-100 rounded-[10px]">
                <FontAwesome6 name={icon} size={36} color={colors.primary400} />
            </View>
            <TextComponent text={text} size={12} />
        </TouchableOpacity>
    );
};

export default function ActionListComponents() {
    return (
        <View className="py-2 flex-1 w-full flex-row justify-around">
            {ActionData.map((item, index) => (
                <ActionCard key={index} text={item.text} icon={item.icon} path={item.path} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({});
