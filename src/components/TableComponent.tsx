import React from 'react';
import { StyleSheet, View } from 'react-native';
import TextComponent from './TextComponent';
import { ActiveAttendanceData } from '@/mockData';

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
                {ActiveAttendanceData.map((item, index) => (
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
