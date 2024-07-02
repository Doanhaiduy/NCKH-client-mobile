import {
    ButtonComponent,
    ItemCardGrid,
    ItemCardList,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { appInfo } from '@/constants/appInfo';
import { colors } from '@/constants/colors';
import { FeaturedActivityData, NewsData, OngoingActivityData } from '@/mockData';
import React from 'react';
import { FlatList, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeBackup() {
    return (
        <ScrollView
            style={{
                paddingTop: appInfo.headerHomeBar,
                backgroundColor: colors.white,
            }}
        >
            <SectionComponent className="border-b-[0.4px]">
                <TextComponent text="Hoạt động nổi bật" className="text-[20px] text-primary-400 mt-2 mb-4" />
                <ItemCardGrid size="large" data={FeaturedActivityData[0]} onPress={() => {}} />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={FeaturedActivityData.slice(1)}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        numColumns={2}
                        ListFooterComponent={() => (
                            <View className="items-center">
                                <SpaceComponent height={16} />
                                <ButtonComponent title="Xem thêm" size="small" type="primary" onPress={() => {}} />
                            </View>
                        )}
                        renderItem={({ item }) => <ItemCardGrid size="medium" data={item} onPress={() => {}} />}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className="">
                <TextComponent text="Tin tức" className="text-[20px] text-primary-400 mt-2 mb-4" />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={NewsData}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        ListFooterComponent={() => (
                            <View className="items-center">
                                <SpaceComponent height={16} />
                                <ButtonComponent title="Xem thêm" size="small" type="primary" onPress={() => {}} />
                            </View>
                        )}
                        renderItem={({ item }) => <ItemCardList data={item} onPress={() => {}} />}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className="border-b-[0.4px]">
                <TextComponent text="Hoạt động đang diễn ra" className="text-[20px] text-primary-400 mt-2 mb-4" />
                <ItemCardGrid size="large" data={OngoingActivityData[0]} onPress={() => {}} />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={OngoingActivityData.slice(1)}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        numColumns={2}
                        ListFooterComponent={() => (
                            <View className="items-center">
                                <SpaceComponent height={16} />
                                <ButtonComponent title="Xem thêm" size="small" type="primary" onPress={() => {}} />
                            </View>
                        )}
                        renderItem={({ item }) => <ItemCardGrid size="medium" data={item} onPress={() => {}} />}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className="">
                <TextComponent text="Hoạt động đã diễn ra" className="text-[20px] text-primary-400 mt-2 mb-4" />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={OngoingActivityData.slice(1)}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        ListFooterComponent={() => (
                            <View className="items-center">
                                <SpaceComponent height={16} />
                                <ButtonComponent title="Xem thêm" size="small" type="primary" onPress={() => {}} />
                            </View>
                        )}
                        renderItem={({ item }) => <ItemCardList data={item} onPress={() => {}} />}
                    />
                </View>
            </SectionComponent>
        </ScrollView>
    );
}

const styles = StyleSheet.create({});
