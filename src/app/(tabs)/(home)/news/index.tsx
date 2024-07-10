import { ContainerComponent, ItemCardList, SectionComponent, TextComponent } from '@/components';
import { appInfo } from '@/constants/appInfo';
import { EventData } from '@/mockData';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

export default function NewsList() {
    return (
        <ScrollView
            style={{
                flex: 1,
                marginTop: appInfo.headerHomeBar,
            }}
            showsVerticalScrollIndicator={false}
        >
            <SectionComponent className="flex-1">
                <TextComponent text="Tin tức" className="text-[20px] text-primary-500 font-interMd mt-2 mb-4" />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={EventData}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={item}
                                onPress={() => {
                                    router.push({
                                        pathname: `/news/details/${item.id}`,
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
