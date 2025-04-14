import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import ButtonComponent from './ButtonComponent';
import CardComponent from './CardComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import { dateFormatLocale } from '@/utils/dateTime';
import ImageComponent from './ImageComponent';
import { useTranslation } from 'react-i18next';

interface Props {
    data: EventCard | CardItemData;
    onPress?: () => void;
    isShadow?: boolean;
    isAction?: boolean;
    onPressButton?: () => void;
}

export default function ItemCardList(props: Props) {
    const { t } = useTranslation();
    const { data, onPress, isShadow, isAction, onPressButton } = props;

    return (
        <CardComponent
            onPress={onPress && onPress}
            isShadow={isShadow}
            className='bg-white min-w-full flex-row shadow-sm p-4'
            style={{
                shadowColor: colors.black,
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 2,
            }}
        >
            <View className='flex-1 pr-3 min-h-[100px] justify-between'>
                <TextComponent numberOfLines={3} text={(data as EventCard).name || (data as CardItemData).title} />
                <View className='justify-between'>
                    <RowComponent className='flex-1'>
                        <Ionicons name='calendar' size={14} color={colors.black} />
                        <TextComponent
                            text={dateFormatLocale((data as EventCard).startAt || (data as CardItemData).createdAt)}
                            className='text-[13px] text-text-400 ml-1'
                        />
                    </RowComponent>
                    {isAction && (
                        <View className='items-start mt-2'>
                            <ButtonComponent
                                title={t('item_card_list_component.attendance')}
                                size='small'
                                type='primary'
                                onPress={() => onPressButton && onPressButton()}
                            />
                        </View>
                    )}
                </View>
            </View>
            <View className='w-[40%] aspect-square max-h-[100px]'>
                <ImageComponent url={data.thumbnail!} imageClass='w-full h-full' rounded={10} />
            </View>
        </CardComponent>
    );
}
