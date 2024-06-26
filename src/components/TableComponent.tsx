import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import TextComponent from './TextComponent';

const ActiveData = [
    {
        id: 1,
        activity: 'HD00123_20240202',
        time: '02/02/2024 06:50:40 PM',
    },
    {
        id: 2,
        activity: 'HD00123_20240202',
        time: '02/02/2024 06:50:40 PM',
    },
    {
        id: 3,
        activity: 'HD00123_20240202',
        time: '02/02/2024 06:50:40 PM',
    },
    {
        id: 4,
        activity: 'HD00123_20240202',
        time: '02/02/2024 06:50:40 PM',
    },
];

export default function TableComponent() {
    return (
        <View className="min-w-full flex-1 px-2">
            <View className="flex-row flex-nowrap flex-1 border-y-[1px] py-5 gap-x-4">
                <View className="w-[5%] items-start">
                    <TextComponent text="#" fontBold />
                </View>
                <View className="flex-1 items-start max-w-[60%]">
                    <TextComponent text="Hoạt động " fontBold />
                </View>
                <View className="flex-1 items-start max-w-[35%]">
                    <TextComponent text="Thời gian" fontBold />
                </View>
            </View>
            {/* Body */}
            <View className="flex-1">
                {ActiveData.map((item, index) => (
                    <View key={item.id} className="flex-row flex-nowrap flex-1 gap-x-4 py-5">
                        <View className="w-[5%] items-start">
                            <TextComponent text={`${index + 1}`} />
                        </View>
                        <View className="flex-1 items-start max-w-[60%]">
                            <TextComponent text={item.activity} />
                        </View>
                        <View className="flex-1 items-start max-w-[35%]">
                            <TextComponent text={item.time} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
