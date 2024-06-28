import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CardComponent from './CardComponent';
import TextComponent from './TextComponent';
import RowComponent from './RowComponent';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import ButtonComponent from './ButtonComponent';

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
    onPressButton?: () => void;
}

export default function ItemCardList(props: Props) {
    const { data, onPress, isShadow, isAction, onPressButton } = props;

    return (
        <CardComponent onPress={onPress} isShadow={isShadow} className=" bg-white min-w-full  flex-1 flex-row">
            <View className="flex-1 pr-3">
                <TextComponent numberOfLines={3} text={data.title} />
                <RowComponent className="justify-between">
                    <RowComponent>
                        <Ionicons name="calendar" size={14} color={colors['text800']} />
                        <TextComponent text={data.time} className="text-[13px] text-text-800 ml-1" />
                    </RowComponent>
                    {isAction && (
                        <ButtonComponent
                            title="Điểm danh"
                            size="small"
                            type="primary"
                            onPress={() => onPressButton && onPressButton()}
                        />
                    )}
                </RowComponent>
            </View>
            <View className="w-[30%] ">
                <Image
                    source={require('../assets/images/TFT.jpg')}
                    resizeMode="cover"
                    className="w-full h-full object-cover rounded-[5px]"
                />
            </View>
        </CardComponent>
    );
}

const styles = StyleSheet.create({});
