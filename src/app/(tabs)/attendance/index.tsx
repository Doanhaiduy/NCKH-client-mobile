import eventAPI from '@/apis/eventApi';
import {
    ButtonComponent,
    ContainerComponent,
    ItemCardList,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { authSelector } from '@/stores/reducers/authReducer';
import { useQueries } from '@tanstack/react-query';
import { router, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function Attendance() {
    const navigation = useNavigation();
    const { authData } = useSelector(authSelector);

    const [eventActive, eventInactive] = useQueries({
        queries: [
            {
                queryKey: ['events-ongoing'],
                queryFn: () =>
                    eventAPI.getEvents(authData?.id || '', {
                        page: 1,
                        size: 10,
                        status: 'active',
                        time: 'ongoing',
                    }),
            },
            {
                queryKey: ['events-past'],
                queryFn: () =>
                    eventAPI.getEvents(authData?.id || '', {
                        page: 1,
                        size: 10,
                        status: 'active',
                        time: 'past',
                    }),
            },
        ],
    });

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            navigation.dispatch(e.data.action);
        });
    }, []);

    return (
        <ContainerComponent
            iconLeft="logo"
            title="Điểm danh"
            isScroll
            _refreshing={eventActive.isFetching || eventInactive.isFetching}
            notification
            handleRefresh={() => {
                eventActive.refetch();
                eventInactive.refetch();
            }}
        >
            <SectionComponent>
                <TextComponent
                    text="Hoạt động đang diễn ra"
                    className="text-[20px] text-primary-500 font-interMd mt-2 mb-4 "
                />
                <View className="w-full">
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
            <View className=" w-[80%] mx-auto py-5">
                <ButtonComponent
                    title="Xem hoạt động đã điểm danh"
                    size="large"
                    type="primary"
                    onPress={() => {
                        router.push({
                            pathname: '/attendance/list',
                            params: {
                                back: 'to_attendance',
                            },
                        });
                    }}
                />
            </View>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
