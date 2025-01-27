import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import ButtonComponent from './ButtonComponent';
import CardComponent from './CardComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import { dateFormatLocale } from '@/utils/dateTime';
import ImageComponent from './ImageComponent';

interface Props {
    data: EventCard | CardItemData;
    onPress?: () => void;
    isShadow?: boolean;
    isAction?: boolean;
    onPressButton?: () => void;
}

export default function ItemCardList(props: Props) {
    const { data, onPress, isShadow, isAction, onPressButton } = props;

    return (
        <CardComponent onPress={onPress && onPress} isShadow={isShadow} className="bg-white min-w-full flex-row">
            <View className="flex-1 pr-3 min-h-[100px] justify-between">
                <TextComponent numberOfLines={3} text={(data as EventCard).name || (data as CardItemData).title} />
                <RowComponent className="justify-between">
                    <RowComponent className="flex-1">
                        <Ionicons name="calendar" size={14} color={colors.black} />
                        <TextComponent
                            text={dateFormatLocale((data as EventCard).startAt || (data as CardItemData).createdAt)}
                            className="text-[13px] text-text-400 ml-1"
                        />
                    </RowComponent>
                    {isAction && (
                        <View className="flex-1 items-end">
                            <ButtonComponent
                                title="Điểm danh"
                                size="small"
                                type="primary"
                                onPress={() => onPressButton && onPressButton()}
                            />
                        </View>
                    )}
                </RowComponent>
            </View>
            <View className="w-[30%] aspect-square max-h-[100px]">
                <ImageComponent url={data.thumbnail!} imageClass="w-full h-full" rounded={10} />
            </View>
        </CardComponent>
    );
}

const styles = StyleSheet.create({});
