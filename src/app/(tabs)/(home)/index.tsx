import postAPI from '@/apis/postApi';
import {
    ActionListComponents,
    ButtonComponent,
    ItemCardGrid,
    ItemCardList,
    SectionComponent,
    SlideCardComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { appInfo } from '@/constants/appInfo';
import { colors } from '@/constants/colors';
import { EventData } from '@/mockData';
import { authSelector } from '@/stores/reducers/authReducer';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function Home() {
    const { authData } = useSelector(authSelector);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['posts'],
        queryFn: () => postAPI.getPosts({ page: 1, size: 4 }),
    });

    useEffect(() => {
        console.log(data);
        console.log(error);
    }, [data]);

    return (
        <ScrollView
            style={{
                paddingTop: appInfo.headerHomeBar,
                backgroundColor: colors.white,
                flex: 1,
            }}
            contentContainerStyle={{ paddingBottom: appInfo.headerHomeBar }}
            showsVerticalScrollIndicator={false}
        >
            <View className="pt-4">
                <SlideCardComponent data={data?.data || []} autoPlay duration={4000} />
            </View>
            <TouchableOpacity
                onPress={() => {
                    refetch();
                }}
            >
                <TextComponent text="refetch" />
            </TouchableOpacity>
            <SectionComponent className="border-b-[0.4px]">
                <ActionListComponents />
                <TextComponent
                    text="Hoạt động nổi bật"
                    className="text-[20px] text-primary-500 font-interMd mt-2 mb-4"
                />

                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={data?.data || []}
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
                        renderItem={({ item }) => (
                            <ItemCardGrid size="medium" isShadow data={item} onPress={() => {}} />
                        )}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className="">
                <TextComponent text="Tin tức" className="text-[20px] text-primary-500 font-interMd mt-2 mb-4" />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={EventData}
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
                <TextComponent
                    text="Hoạt động đang diễn ra"
                    className="text-[20px] text-primary-500 font-interMd mt-2 mb-4"
                />
                <ItemCardGrid size="large" data={EventData[0]} onPress={() => {}} />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={EventData.slice(1)}
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
                        renderItem={({ item }) => (
                            <ItemCardGrid isShadow size="medium" data={item} onPress={() => {}} />
                        )}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className="">
                <TextComponent
                    text="Hoạt động đã diễn ra"
                    className="text-[20px] text-primary-500 font-interMd mt-2 mb-4"
                />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={EventData.slice(1)}
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
