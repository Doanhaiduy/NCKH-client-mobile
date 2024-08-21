import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import TextComponent from './TextComponent';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { globalStyles } from '@/styles';

let ActionDataTemp: {
    icon: string;
    text: string;
    path: string;
}[] = [
    {
        icon: 'check-to-slot',
        text: 'Đã điểm danh',
        path: 'Registered',
    },
    {
        icon: 'check-to-slot',
        text: 'Điểm danh',
        path: '/attendance/list',
    },
    {
        icon: 'check-to-slot',
        text: 'Điểm rèn luyện',
        path: '/training-point',
    },
    {
        icon: 'check-to-slot',
        text: 'Khảo sát',
        path: '/training-point',
    },
    {
        icon: 'check-to-slot',
        text: 'Thông báo',
        path: '/training-point',
    },
    {
        icon: 'check-to-slot',
        text: 'Tin tức',
        path: 'Registered',
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
        <TouchableOpacity
            className="items-center justify-between w-[25%] mb-2 "
            onPress={() =>
                router.push({
                    pathname: path,
                })
            }
        >
            <View className="mb-1 w-[60px] h-[60px] items-center justify-center border-[1px] border-text-100 rounded-[10px]">
                <FontAwesome6 name={icon} size={36} color={colors.primary400} />
            </View>
            <TextComponent text={text} size={12} className="text-center" />
        </TouchableOpacity>
    );
};

export default function ActionListComponents() {
    const [expended, setExpended] = React.useState(false);
    const [ActionData, setActionData] = React.useState(ActionDataTemp.slice(0, 4));

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(expended ? 350 : 160, { duration: 300 }),
        };
    });

    const handleExpended = () => {
        setExpended(!expended);
        setActionData(!expended ? ActionDataTemp : ActionDataTemp.slice(0, 4));
    };
    return (
        // <View className='py-2 flex-1 w-full flex-row justify-start flex-wrap'>
        //     {ActionData.map((item, index) => (
        //         <ActionCard key={index} text={item.text} icon={item.icon} path={item.path} />
        //     ))}
        // </View>
        <Animated.View
            style={[animatedContainerStyle]}
            className="py-2 flex-1 w-full flex-row items-start justify-start flex-wrap bg-white overflow-hidden"
        >
            {ActionData.map((item, index) => (
                <ActionCard key={index} text={item.text} icon={item.icon} path={item.path} />
            ))}
            <View
                className="absolute "
                style={[
                    globalStyles.centerAbsolute,
                    {
                        bottom: 0,
                        top: 'auto',
                        backgroundColor: colors.white,
                        width: '100%',
                    },
                ]}
            >
                <TouchableOpacity
                    onPress={handleExpended}
                    className="bg-primary-100 p-2 justify-center items-center rounded-full"
                >
                    <Feather name={expended ? 'chevrons-up' : 'chevrons-down'} size={20} color={colors.primary400} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({});
