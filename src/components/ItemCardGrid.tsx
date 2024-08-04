import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import CardComponent from './CardComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import { dateFormat } from '@/utils/dateTime';

interface Props {
    data: CardItemData;
    size: 'medium' | 'large';
    onPress?: () => void;
    isShadow?: boolean;
}

export default function ItemCardGrid(props: Props) {
    const { data, onPress, size, isShadow } = props;

    const containerClass = clsx(
        size === 'medium' ? 'bg-white max-w-[48%] min-h-[184px] ' : 'bg-text-100 min-w-full min-h-[248px]',
    );
    const imageClass = clsx(
        'rounded-t-[10px] w-full object-cover',
        size === 'medium' && 'rounded-b-[10px] h-[100px]',
        size === 'large' && 'h-[150px]',
    );
    const containerTextClass = clsx(size === 'medium' && 'px-1 pt-2 pr-2', size === 'large' && 'px-4 pt-4');
    const textClass = clsx(size === 'medium' && 'text-[14px]', size === 'large' && 'text-[16px] h-[50px]');
    return (
        <CardComponent onPress={onPress} className={containerClass} isShadow={isShadow}>
            <View>
                <Image
                    source={{
                        uri: data.thumbnail || 'https://via.placeholder.com/150',
                    }}
                    className={imageClass}
                    resizeMode="cover"
                />
            </View>

            <View className={containerTextClass}>
                <TextComponent className={textClass} numberOfLines={2} text={data.title} />
                <RowComponent className="">
                    <Ionicons name="calendar" size={14} color={colors.black} />
                    <TextComponent text={dateFormat(data.createdAt)} className="ml-1 text-[13px] text-text-400" />
                </RowComponent>
            </View>
        </CardComponent>
    );
}

const styles = StyleSheet.create({});
