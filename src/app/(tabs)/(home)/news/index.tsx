import postAPI from '@/apis/postApi';
import { ContainerComponent, ItemCardList, SectionComponent, TextComponent } from '@/components';
import { appInfo } from '@/constants/appInfo';
import { EventData } from '@/mockData';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from 'react-native';

export default function NewsList() {
    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
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

    // console.log('PAGE', data?.pages[0]);
    const loadMore = () => {
        if (hasNextPage) {
            console.log('LOAD MORE', data?.pageParams);
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
                        keyExtractor={(item, index) => index.toString()}
                        data={data?.pages.map((page) => page.data).flat()}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={() => (
                            <TextComponent
                                text="Tin tức"
                                className="text-[20px] text-primary-500 font-interMd mt-2 mb-4"
                            />
                        )}
                        ListFooterComponent={() => (isFetchingNextPage ? <ActivityIndicator size={'large'} /> : null)}
                        onEndReachedThreshold={0.3}
                        onEndReached={loadMore}
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
