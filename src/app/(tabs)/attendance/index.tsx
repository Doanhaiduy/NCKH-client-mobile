import eventAPI from "@/apis/eventApi";
import { ButtonComponent, ContainerComponent, ItemCardList, SectionComponent, TextComponent } from "@/components";
import { authSelector } from "@/stores/reducers/authReducer";
import { useQueries } from "@tanstack/react-query";
import { router, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function Attendance() {
    const navigation = useNavigation();

    const [eventActive, eventInactive, eventRegistered] = useQueries({
        queries: [
            {
                queryKey: ["events-ongoing"],
                queryFn: () =>
                    eventAPI.getEvents({
                        page: 1,
                        size: 10,
                        status: "active",
                        time: "ongoing",
                        typeEvent: "mandatory",
                    }),
            },
            {
                queryKey: ["events-past"],
                queryFn: () =>
                    eventAPI.getEvents({
                        page: 1,
                        size: 10,
                        status: "active",
                        time: "past",
                    }),
            },
            {
                queryKey: ["events-registered"],
                queryFn: () =>
                    eventAPI.getEvents({
                        page: 1,
                        size: 10,
                        status: "active",
                        time: "ongoing",
                        typeEvent: "optional",
                    }),
            },
        ],
    });

    useEffect(() => {
        navigation.addListener("beforeRemove", (e) => {
            e.preventDefault();
            navigation.dispatch(e.data.action);
        });
    }, []);

    return (
        <ContainerComponent
            iconLeft="logo"
            title="Điểm danh"
            isScroll
            _refreshing={eventActive.isFetching || eventInactive.isFetching || eventRegistered.isFetching}
            notification
            handleRefresh={() => {
                eventActive.refetch();
                eventInactive.refetch();
                eventRegistered.refetch();
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
                        ListEmptyComponent={() => (
                            <TextComponent text="Không có dữ liệu" className="text-center text-text-200" />
                        )}
                        data={eventActive?.data?.events}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={item}
                                onPress={() => {}}
                                onPressButton={() => {
                                    router.push(`/attendance/${item._id}`);
                                }}
                                isAction
                            />
                        )}
                    />
                </View>
            </SectionComponent>

            <SectionComponent className="border-t-[1px] border-text-200 flex-1">
                <TextComponent
                    text="Hoạt động đã đăng ký"
                    className="text-[20px] text-primary-500 font-interMd mt-2 mb-4"
                />
                <View className="w-full">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={eventRegistered.data?.events}
                        ListEmptyComponent={() => (
                            <TextComponent text="Không có dữ liệu" className="text-center text-text-200" />
                        )}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={item}
                                onPress={() => {}}
                                onPressButton={() => {
                                    router.push(`/attendance/${item._id}`);
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
                <View className="w-full">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={eventInactive.data?.events}
                        ListEmptyComponent={() => (
                            <TextComponent text="Không có dữ liệu" className="text-center text-text-200" />
                        )}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => <ItemCardList data={item} />}
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
                            pathname: "/attendance/list",
                            params: {
                                back: "to_attendance",
                            },
                        });
                    }}
                />
            </View>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
