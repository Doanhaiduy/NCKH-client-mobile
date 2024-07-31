import eventAPI from '@/apis/eventApi';
import { ButtonComponent, ContainerComponent, ItemCardList, SectionComponent, TextComponent } from '@/components';
import { useQueries } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export default function Attendance() {
    const [eventActive, eventInactive] = useQueries({
        queries: [
            {
                queryKey: ['events-active'],
                queryFn: () =>
                    eventAPI.getEvents({
                        page: 1,
                        size: 4,
                        status: 'active',
                    }),
            },
            {
                queryKey: ['events-inactive'],
                queryFn: () =>
                    eventAPI.getEvents({
                        page: 1,
                        size: 4,
                        status: 'inactive',
                    }),
            },
        ],
    });
    return (
        <ContainerComponent
            iconLeft="logo"
            title="Điểm danh"
            isScroll
            _refreshing={eventActive.isFetching || eventInactive.isFetching}
            search
            handleRefresh={() => {
                eventActive.refetch();
                eventInactive.refetch();
            }}
        >
            <SectionComponent className="flex-1">
                <TextComponent
                    text="Hoạt động đang diễn ra"
                    className="text-[20px] text-primary-500 font-interMd mt-2 mb-4 "
                />
                <View className="">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={eventActive?.data?.events}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={item}
                                onPress={() => {}}
                                onPressButton={() => {
                                    router.push(`/attendance/${item.id}`);
                                }}
                                isAction
                            />
                        )}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className="border-t-[1px] border-text-200 flex-1">
                <TextComponent
                    text="Hoạt động đã diễn ra"
                    className="text-[20px] text-primary-500 font-interMd mt-2 mb-4"
                />
                <View className="">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={eventInactive.data?.events}
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
