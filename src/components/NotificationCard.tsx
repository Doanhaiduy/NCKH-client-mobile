import { colors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';

type Data = {
    title: String;
    description: String;
    time: String;
    id: String;
};

interface Props {
    data: Data;
    isNew?: boolean;
}

export default function NotificationCard(props: Props) {
    const { data, isNew = true } = props;

    return (
        <TouchableOpacity
            className="px-4 py-2 border-b-[1px] border-text-500"
            style={{
                backgroundColor: isNew ? '#235DF408' : '#fff',
            }}
        >
            <RowComponent className="justify-between">
                <TextComponent text={data?.title?.toString()} size={20} className="font-interMd" />
                {isNew && <View className="w-2 h-2 rounded-full bg-primary-400"></View>}
            </RowComponent>
            <TextComponent text={data?.description?.toString()} numberOfLines={1} className="pr-5 py-1" />
            <RowComponent className="justify-between pr-5">
                <TextComponent text={data?.time?.toString()} color={colors.text600} />
                <TextComponent text="Xem chi tiết" color={colors.primary400} />
            </RowComponent>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({});
