import { colors } from '@/constants/colors';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import { dateFormatLocale } from '@/utils/dateTime';

interface Props {
    data: _Notification;
    isNew?: boolean;
    onPress?: () => void;
}

export default function NotificationCard(props: Props) {
    const { data, onPress, isNew = true } = props;

    return (
        <TouchableOpacity
            className='px-4 py-2 flex-1 border-b-[1px] border-text-200'
            style={{
                backgroundColor: isNew ? '#03009908' : '#fff',
            }}
            onPress={onPress}
        >
            <RowComponent className='justify-between'>
                <TextComponent text={data?.message?.toString()} size={20} className='font-interMd' numberOfLines={2} />
                {isNew && (
                    <View
                        className='w-2 h-2 bg-primary-400'
                        style={{
                            borderRadius: 99,
                        }}
                    ></View>
                )}
            </RowComponent>
            <TextComponent text={data?.description?.toString() || ''} numberOfLines={1} className='pr-5 py-1' />
            <RowComponent className='justify-between pr-5'>
                <TextComponent text={dateFormatLocale(data?.createdAt)} color={colors.text400} />
            </RowComponent>
        </TouchableOpacity>
    );
}
