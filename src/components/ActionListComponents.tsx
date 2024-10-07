import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import TextComponent from './TextComponent';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';
import { globalStyles } from '@/styles';

let ActionDataTemp: {
    icon: string;
    text: string;
    path: string;
}[] = [
    {
        icon: 'check-to-slot',
        text: 'Tin tức',
        path: '/',
    },
    {
        icon: 'check-to-slot',
        text: 'Đã điểm danh',
        path: '/attendance/list',
    },
    {
        icon: 'check-to-slot',
        text: 'Kết quả rèn luyện',
        path: '/training-point',
    },
    {
        icon: 'check-to-slot',
        text: 'Khảo sát',
        path: '/feedback',
    },
    {
        icon: 'check-to-slot',
        text: 'Thông báo',
        path: '/notification',
    },
    {
        icon: 'check-to-slot',
        text: 'Tài khoản',
        path: '/setting',
    },
    {
        icon: 'check-to-slot',
        text: 'Đã đăng ký',
        path: '/attendance/list',
    },
    {
        icon: 'check-to-slot',
        text: 'Đang diễn ra',
        path: '/training-point',
    },
    {
        icon: 'check-to-slot',
        text: 'Đã diễn ra',
        path: '/setting',
    },
    {
        icon: 'check-to-slot',
        text: 'Tài khoản',
        path: '/setting',
    },
    {
        icon: 'check-to-slot',
        text: 'Góp ý',
        path: '/setting',
    },
];

const ActionCard = ({ text, icon, path }: { text: string; icon: string; path: string }) => {
    return (
        <View className="w-[25%] p-2">
            <TouchableOpacity
                className="items-center mb-2 px-2 py-3 bg-primary-100 rounded-xl"
                style={[globalStyles.shadow, { minHeight: 130 }]}
                onPress={() =>
                    router.push({
                        pathname: path,
                    })
                }
            >
                <View className="mb-2 w-16 aspect-square items-center justify-center ">
                    <FontAwesome6 name={icon} size={36} color={colors.primary400} />
                </View>
                <TextComponent
                    text={text}
                    size={12}
                    className="text-center"
                    numberOfLines={2}
                    style={{
                        lineHeight: 16,
                    }}
                />
            </TouchableOpacity>
        </View>
    );
};

export default function ActionListComponents() {
    const [ActionData, setActionData] = React.useState(ActionDataTemp);

    return (
        <Animated.View className="py-2 flex-1 w-full flex-row items-stretch justify-start flex-wrap bg-white overflow-hidden pb-[50px]">
            {ActionData.map((item, index) => (
                <ActionCard key={index} text={item.text} icon={item.icon} path={item.path} />
            ))}
        </Animated.View>
    );
}

const styles = StyleSheet.create({});
