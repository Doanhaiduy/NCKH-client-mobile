import { ContainerComponent, ItemCardGrid, ItemCardList, SectionComponent, TextComponent } from '@/components';
import { appInfo } from '@/constants/appInfo';
import { EventData } from '@/mockData';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

export default function OngoingEventList() {
    return (
        <ScrollView
            style={{
                flex: 1,
                marginTop: appInfo.headerHomeBar,
            }}
            showsVerticalScrollIndicator={false}
        >
            <SectionComponent className="flex-1">
                <TextComponent text="Đang diễn ra" className="text-[20px] text-primary-500 font-interMd mt-2 mb-4" />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={EventData}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ItemCardGrid
                                size="large"
                                data={item}
                                onPress={() => {
                                    router.push({
                                        pathname: `/ongoing-events/details/${item.id}`,
                                        params: {
                                            eventName: 'Hoạt động ngoại khóa',
                                        },
                                    });
                                }}
                            />
                        )}
                    />
                </View>
            </SectionComponent>
        </ScrollView>
    );
}

const styles = StyleSheet.create({});
