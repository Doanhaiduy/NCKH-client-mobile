import postAPI from '@/apis/postApi';
import { ContainerComponent, ItemCardGrid, ItemCardList, SectionComponent, TextComponent } from '@/components';
import { appInfo } from '@/constants/appInfo';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

export default function OngoingEventList() {
    const { handleScroll } = useScrollAnimation();

    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch } =
        useInfiniteQuery({
            queryKey: ['ongoing-events'],
            initialPageParam: 1,
            queryFn: ({ pageParam }) =>
                postAPI.getPosts({
                    page: pageParam,
                    size: 10,
                    category: 'activity',
                }),
            getNextPageParam: (lastPage, pages) => {
                const nextPage = parseInt(lastPage.page) + 1;
                if (lastPage.next > 0) {
                    return lastPage.next > 0 ? nextPage : undefined;
                }
            },
        });

    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    return (
        <View
            style={{
                flex: 1,
                marginTop: appInfo.headerHomeBar,
            }}
        >
            <SectionComponent className="flex-1">
                <View className="flex-1">
                    <FlatList
                        onScroll={handleScroll}
                        keyExtractor={(item, index) => index.toString()}
                        data={data?.pages.map((page) => page.data).flat()}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={() => (
                            <TextComponent
                                text="Đang diễn ra"
                                className="text-[20px] text-primary-500 font-interMd mt-2 mb-4"
                            />
                        )}
                        ListFooterComponent={() => (isFetchingNextPage ? <ActivityIndicator size={'large'} /> : null)}
                        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
                        onEndReachedThreshold={0.3}
                        onEndReached={loadMore}
                        renderItem={({ item }) => (
                            <ItemCardGrid
                                size="large"
                                data={item}
                                onPress={() => {
                                    router.push({
                                        pathname: `/registered-events/details/${item.id}`,
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
        </View>
    );
}

const styles = StyleSheet.create({});
