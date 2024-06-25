import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CardComponent from './CardComponent';
import TextComponent from './TextComponent';
import RowComponent from './RowComponent';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import clsx from 'clsx';

type data = {
    title: string;
    time: string;
    description: string;
    image: string;
};

interface Props {
    data: data;
    size: 'medium' | 'large';
    onPress?: () => void;
    isShadow?: boolean;
}

export default function ItemCardGrid(props: Props) {
    const { data, onPress, size, isShadow } = props;

    const containerClass = clsx(
        size === 'medium' ? 'bg-white max-w-[48%] min-h-[184px] ' : 'bg-text-600 min-w-full min-h-[228px] flex-1'
    );
    const imageClass = clsx(
        'rounded-t-[10px] w-full object-cover',
        size === 'medium' && 'rounded-b-[10px] h-[100px]',
        size === 'large' && 'h-[150px]'
    );
    const containerTextClass = clsx(size === 'medium' && 'px-1 pt-2 pr-2', size === 'large' && 'px-4 pt-4');
    const textClass = clsx(size === 'medium' && 'text-[14px]', size === 'large' && 'text-[16px]');
    return (
        <CardComponent onPress={onPress} className={containerClass} isShadow={isShadow}>
            <View>
                <Image source={require('../assets/images/event-card.png')} className={imageClass} resizeMode='cover' />
            </View>

            <View className={containerTextClass}>
                <TextComponent
                    className={textClass}
                    numberOfLines={2}
                    text='Thông báo về việc đăng kí tham gia giải bóng chuyền nam – nữ khoa công nghệ giải bóng chuyền nam – nữ khoa công nghệ thông tin '
                />
                <RowComponent>
                    <Ionicons name='calendar' size={14} color={colors['text800']} />
                    <TextComponent text='10/10/2021' className='ml-1 text-[13px] text-text-800' />
                </RowComponent>
            </View>
        </CardComponent>
    );
}

const styles = StyleSheet.create({});
