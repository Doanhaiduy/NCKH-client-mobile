import React from 'react';
import { View } from 'react-native';
import TextComponent from './TextComponent';
import { dateFormatLocale } from '@/utils/dateTime';
import { useTranslation } from 'react-i18next';

interface Props {
    data: AttendanceDetails[];
}

export default function TableComponent(props: Props) {
    const { t } = useTranslation();
    const { data } = props;

    return (
        <View className='min-w-full flex-1 px-2 ml-4'>
            <View className='flex-row flex-nowrap flex-1 border-text-200 border-[1px] gap-x-4'>
                <View className='w-[10%] items-start py-4 border-text-200 border-r-[1px]'>
                    <TextComponent text={t('table_component.index')} fontBold />
                </View>
                <View className='flex-1 items-start py-4 border-text-200 border-r-[1px] max-w-[45%]'>
                    <TextComponent text={t('table_component.activity_name')} fontBold />
                </View>
                <View className='flex-1 items-start py-4 max-w-[45%]'>
                    <TextComponent text={t('table_component.time')} fontBold />
                </View>
            </View>
            {/* Body */}
            <View className='flex-1'>
                {data.map((item, index) => (
                    <View
                        key={item._id}
                        className='flex-row flex-nowrap flex-1 gap-x-4 border-[1px] border-text-200 border-t-0'
                    >
                        <View className='w-[10%] items-start border-text-200 border-r-[1px] pr-2 py-2'>
                            <TextComponent text={`${index + 1}`} />
                        </View>
                        <View className='flex-1 items-start border-text-200 border-r-[1px] pr-2 py-2 max-w-[45%]'>
                            <TextComponent text={item.event.name} />
                        </View>
                        <View className='flex-1 items-start pr-2 py-2 max-w-[45%]'>
                            <TextComponent text={dateFormatLocale(item.checkInAt)} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
