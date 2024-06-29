import { ButtonComponent, ContainerComponent, ItemCardList, SectionComponent, TextComponent } from '@/components';
import { FinishedActivityData, OngoingActivityData } from '@/mockData';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export default function Attendance() {
    return (
        <ContainerComponent iconLeft="menu" title="Điểm danh" isScroll search>
            <SectionComponent className="">
                <TextComponent text="Hoạt động đang diễn ra" className="text-[20px] text-primary-400 mt-2 mb-4" />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={OngoingActivityData}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={item}
                                onPress={() => {}}
                                onPressButton={() => {
                                    router.push({
                                        pathname: `/attendance/${item.id}`,
                                        params: {
                                            eventName: item.title,
                                        },
                                    });
                                }}
                                isAction
                            />
                        )}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className="border-t-[1px] border-text-500">
                <TextComponent text="Hoạt động đã diễn ra" className="text-[20px] text-primary-400 mt-2 mb-4" />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={FinishedActivityData}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={item}
                                // onPressButton={() => {
                                //     router.push({
                                //         pathname: `/attendance/${item.id}`,
                                //         params: {
                                //             eventName: item.title,
                                //         },
                                //     });
                                // }}
                            />
                        )}
                    />
                </View>
            </SectionComponent>
            <View className=" w-[80%] mx-auto">
                <ButtonComponent
                    title="Xem hoạt động đã điểm danh"
                    size="large"
                    type="primary"
                    onPress={() => {
                        router.push('/attendance/list');
                    }}
                />
            </View>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
