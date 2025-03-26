import { Image, TouchableOpacity, View } from 'react-native';
import React from 'react';
import TextComponent from './TextComponent';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';
import { globalStyles } from '@/styles';
import { useTranslation } from 'react-i18next';

let ActionDataTemp: {
    icon: string;
    text: string;
    path: string;
}[] = [
    {
        icon: require('../assets/images/home/icon_news.png'),
        text: 'action_list_component.news',
        path: '/news',
    },
    {
        icon: require('../assets/images/home/icon_activity.png'),
        text: 'action_list_component.activity',
        path: '/activity',
    },
    {
        icon: require('../assets/images/home/icon_attendance.png'),
        text: 'action_list_component.attendance',
        path: '/attendance/list',
    },
    {
        icon: require('../assets/images/home/icon_assessment.png'),
        text: 'action_list_component.training_point',
        path: '/training-point',
    },
    {
        icon: require('../assets/images/home/icon_help.png'),
        text: 'action_list_component.help',
        path: '/setting/helps',
    },
    {
        icon: require('../assets/images/home/icon_feedback.png'),
        text: 'action_list_component.feedback',
        path: '/feedback',
    },
    {
        icon: require('../assets/images/home/icon_setting.png'),
        text: 'action_list_component.setting',
        path: '/setting',
    },
    {
        icon: require('../assets/images/logo-login.png'),
        text: 'action_list_component.nothing',
        path: '',
    },
    {
        icon: require('../assets/images/logo-login.png'),
        text: 'action_list_component.nothing',
        path: '',
    },
    {
        icon: require('../assets/images/logo-login.png'),
        text: 'action_list_component.nothing',
        path: '',
    },
    {
        icon: require('../assets/images/logo-login.png'),
        text: 'action_list_component.nothing',
        path: '',
    },
];

let ActionDataTempHelper: {
    icon: string;
    text: string;
    path: string;
}[] = [
    {
        icon: require('../assets/images/home/icon_news.png'),
        text: 'action_list_component.news',
        path: '/setting/helps/news',
    },
    {
        icon: require('../assets/images/home/icon_activity.png'),
        text: 'action_list_component.activity',
        path: '/setting/helps/activity',
    },
    {
        icon: require('../assets/images/home/icon_activity.png'),
        text: 'action_list_component.attendance_short',
        path: '/setting/helps/attendance',
    },
    {
        icon: require('../assets/images/home/icon_assessment.png'),
        text: 'action_list_component.training_point',
        path: '/setting/helps/training-point',
    },
    {
        icon: require('../assets/images/home/icon_feedback.png'),
        text: 'action_list_component.feedback',
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
    const { t } = useTranslation();

    return (
        <View className='w-[25%] p-2'>
            <TouchableOpacity
                className='items-center mb-2 px-2 py-3 bg-primary-100 rounded-xl'
                style={[globalStyles.shadow, { minHeight: 130 }]}
                onPress={() => {
                    if (path === 'all') {
                        onPress && onPress();
                        return;
                    } else {
                        onClose && onClose();
                        router.push({
                            pathname: path,
                            params: {
                                back: path === '/attendance/list' ? 'to_home' : 'nothing',
                                title: t(text),
                            },
                        });
                    }
                }}
            >
                <View className='mb-2 w-16 aspect-square items-center justify-center '>
                    <Image source={icon ?? require('@/assets/images/fallback.png')} style={{ width: 64, height: 64 }} />
                </View>
                <TextComponent
                    text={t(text)}
                    size={12}
                    className='text-center'
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
    const { t } = useTranslation();
    const { onShowAll, onClose, isHelper, full = false } = props;
    const [ActionData, setActionData] = React.useState(() => {
        let data = isHelper ? ActionDataTempHelper : ActionDataTemp;
        if (!full) {
            data = ActionDataTemp.slice(0, 7);
            data.push({
                icon: require('../assets/images/home/icon_all.png'),
                text: 'action_list_component.all',
                path: 'all',
            });
        }
        return data;
    });

    return (
        <Animated.View className='py-2 flex-1 w-full flex-row items-stretch justify-start flex-wrap bg-white overflow-hidden pb-[20px]'>
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
