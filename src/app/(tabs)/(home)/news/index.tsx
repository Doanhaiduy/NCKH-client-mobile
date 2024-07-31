import postAPI from '@/apis/postApi';
import { ContainerComponent, ItemCardList, SectionComponent, TextComponent } from '@/components';
import { appInfo } from '@/constants/appInfo';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { EventData } from '@/mockData';
import { sleep } from '@/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

export default function NewsList() {
    const { handleScroll } = useScrollAnimation();

    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch } =
        useInfiniteQuery({
            queryKey: ['news-events'],
            initialPageParam: 1,
            queryFn: ({ pageParam }) =>
                postAPI.getPosts({
                    page: pageParam,
                    size: 10,
                    category: 'news',
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
                        data={data?.pages.map((page) => page.posts).flat()}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                            <TextComponent
                                text="Tin tức"
                                className="text-[20px] text-primary-500 font-interMd mt-2 mb-4"
                            />
                        }
                        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
                        removeClippedSubviews={true}
                        initialNumToRender={10}
                        ListFooterComponent={() => (isFetchingNextPage ? <ActivityIndicator size={'large'} /> : null)}
                        onEndReachedThreshold={0.3}
                        onEndReached={loadMore}
                        ListEmptyComponent={
                            <View>
                                <TextComponent text="Không có dữ liệu" />
                            </View>
                        }
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
        </View>
    );
}

const styles = StyleSheet.create({});
