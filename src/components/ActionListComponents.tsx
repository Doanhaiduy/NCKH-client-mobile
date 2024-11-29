import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        icon: require('../assets/images/home/icon_news.png'),
        text: 'Tin tức',
        path: '/news',
    },
    {
        icon: require('../assets/images/home/icon_activity.png'),
        text: 'Hoạt động',
        path: '/activity',
    },
    {
        icon: require('../assets/images/home/icon_attendance.png'),
        text: 'Đã điểm danh',
        path: '/attendance/list',
    },
    {
        icon: require('../assets/images/home/icon_assessment.png'),
        text: 'Kết quả rèn luyện',
        path: '/training-point',
    },
    {
        icon: require('../assets/images/home/icon_help.png'),
        text: 'Trợ giúp',
        path: '/setting/helps',
    },
    {
        icon: require('../assets/images/home/icon_feedback.png'),
        text: 'Góp ý',
        path: '/feedback',
    },
    {
        icon: require('../assets/images/home/icon_setting.png'),
        text: 'Cài đặt',
        path: '/setting',
    },
    {
        icon: require('../assets/images/home/icon_assessment.png'),
        text: 'Kết quả rèn luyện',
        path: '/training-point',
    },
    {
        icon: require('../assets/images/home/icon_help.png'),
        text: 'Trợ giúp',
        path: '/setting/helps',
    },
    {
        icon: require('../assets/images/home/icon_feedback.png'),
        text: 'Góp ý',
        path: '/feedback',
    },
    {
        icon: require('../assets/images/home/icon_setting.png'),
        text: 'Cài đặt',
        path: '/setting',
    },
];

let ActionDataTempHelper: {
    icon: string;
    text: string;
    path: string;
}[] = [
    {
        icon: require('../assets/images/home/icon_news.png'),
        text: 'Tin tức',
        path: '/setting/helps/news',
    },
    {
        icon: require('../assets/images/home/icon_activity.png'),
        text: 'Hoạt động',
        path: '/setting/helps/activity',
    },
    {
        icon: require('../assets/images/home/icon_activity.png'),
        text: 'Điểm danh',
        path: '/setting/helps/attendance',
    },

    {
        icon: require('../assets/images/home/icon_assessment.png'),
        text: 'Kết quả rèn luyện',
        path: '/setting/helps/training-point',
    },
    {
        icon: require('../assets/images/home/icon_feedback.png'),
        text: 'Góp ý',
        path: '/setting/helps/feedback',
    },
];

const ActionCard = ({
    text,
    icon,
    path,
    onPress,
    onClose,
}: {
    text: string;
    icon: any;
    path: string;
    onPress?: () => void;
    onClose?: () => void;
}) => {
    return (
        <View className="w-[25%] p-2">
            <TouchableOpacity
                className="items-center mb-2 px-2 py-3 bg-primary-100 rounded-xl"
                style={[globalStyles.shadow, { minHeight: 130 }]}
                onPress={() => {
                    if (path === 'all') {
                        console.log("Don't have path");
                        onPress && onPress();
                        return;
                    } else {
                        onClose && onClose();
                        router.push({
                            pathname: path,
                            params: {
                                back: path === '/attendance/list' ? 'to_home' : 'nothing',
                                title: text,
                            },
                        });
                    }
                }}
            >
                <View className="mb-2 w-16 aspect-square items-center justify-center ">
                    <Image source={icon ?? require('@/assets/images/fallback.png')} style={{ width: 64, height: 64 }} />
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

interface ActionListComponentsProps {
    full?: boolean;
    onShowAll?: () => void;
    onClose?: () => void;
    isHelper?: boolean;
}

export default function ActionListComponents(props: ActionListComponentsProps) {
    const { onShowAll, onClose, isHelper, full = false } = props;
    const [ActionData, setActionData] = React.useState(() => {
        let data = isHelper ? ActionDataTempHelper : ActionDataTemp;
        if (!full) {
            data = ActionDataTemp.slice(0, 7);
            data.push({
                icon: require('../assets/images/home/icon_all.png'),
                text: 'Tất cả',
                path: 'all',
            });
        }
        return data;
    });

    return (
        <Animated.View className="py-2 flex-1 w-full flex-row items-stretch justify-start flex-wrap bg-white overflow-hidden pb-[20px]">
            {ActionData.map((item, index) => (
                <ActionCard
                    key={index}
                    text={item.text}
                    icon={item.icon}
                    path={item.path}
                    onPress={() => onShowAll && onShowAll()}
                    onClose={() => onClose && onClose()}
                />
            ))}
        </Animated.View>
    );
}

const styles = StyleSheet.create({});
