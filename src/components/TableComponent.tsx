import React from 'react';
import { StyleSheet, View } from 'react-native';
import TextComponent from './TextComponent';
import { dateFormatLocale } from '@/utils/dateTime';

interface Props {
    data: AttendanceDetails[];
}

export default function TableComponent(props: Props) {
    const { data } = props;

    return (
        <View className="min-w-full flex-1 px-2">
            <View className="flex-row flex-nowrap flex-1 border-y-[1px] py-5 gap-x-4">
                <View className="w-[5%] items-start">
                    <TextComponent text="#" fontBold />
                </View>
                <View className="items-start w-[20%]">
                    <TextComponent text="Mã" fontBold />
                </View>
                <View className="flex-1 items-start max-w-[30%]">
                    <TextComponent text="Tên hoạt động " fontBold />
                </View>
                <View className="flex-1 items-start max-w-[35%]">
                    <TextComponent text="Thời gian" fontBold />
                </View>
                <View className="flex-1 items-start max-w-[35%]">
                    <TextComponent text="Trạng thái" fontBold />
                </View>
            </View>
            {/* Body */}
            <View className="flex-1">
                {data.map((item, index) => (
                    <View key={item.id} className="flex-row flex-nowrap flex-1 gap-x-4 py-5">
                        <View className="w-[5%] items-start">
                            <TextComponent text={`${index + 1}`} />
                        </View>
                        <View className=" items-start w-[20%]">
                            <TextComponent text={item.event.eventCode} />
                        </View>
                        <View className="flex-1 items-start max-w-[30%]">
                            <TextComponent text={item.event.name} />
                        </View>
                        <View className="flex-1 items-start max-w-[35%]">
                            <TextComponent text={dateFormatLocale(item.checkInAt)} />
                        </View>
                        <View className="flex-1 items-start max-w-[35%]">
                            <TextComponent text={item.status} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
