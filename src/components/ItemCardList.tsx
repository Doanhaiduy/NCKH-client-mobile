import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CardComponent from './CardComponent';
import TextComponent from './TextComponent';
import RowComponent from './RowComponent';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

type data = {
    title: string;
    time: string;
    image: string;
};

interface Props {
    data: data;
    onPress?: () => void;
    isShadow?: boolean;
    isAction?: boolean;
}

export default function ItemCardList(props: Props) {
    const { data, onPress, isShadow, isAction } = props;

    return (
        <CardComponent onPress={onPress} isShadow={isShadow} className=' bg-white min-w-full  flex-1 flex-row'>
            <View className='flex-1 pr-3'>
                <TextComponent
                    numberOfLines={3}
                    text='Elon Musk khởi kiện OpenAI và CEO Sam Altman vì đi ngược tôn chỉ ban đầu'
                />
                <RowComponent>
                    <Ionicons name='calendar' size={14} color={colors['text-800']} />
                    <TextComponent text='10/10/2021' className='text-[13px] text-text-800' />
                </RowComponent>
            </View>
            <View className='w-[124px] '>
                <Image
                    source={require('../assets/images/TFT.jpg')}
                    resizeMode='cover'
                    className='w-full h-full object-cover rounded-[5px]'
                />
            </View>
        </CardComponent>
    );
}

const styles = StyleSheet.create({});
