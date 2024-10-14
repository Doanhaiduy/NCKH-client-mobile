import postAPI from '@/apis/postApi';
import {
    ContainerComponent,
    ItemCardList,
    SearchComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

export default function ActivityScreen() {
    const [SearchValue, setSearchValue] = React.useState('');
    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch } =
        useInfiniteQuery({
            queryKey: ['activity'],
            initialPageParam: 1,
            queryFn: ({ pageParam }) =>
                postAPI.getPosts({
                    page: pageParam,
                    size: 10,
                    category: 'activity',
                    search: SearchValue,
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

    const handleSubmit = async (text?: string) => {
        const searchItemAsync = AsyncStorage.getItem('searchItem');
        const textValue = text ? text : SearchValue;
        console.log('====================', textValue);

        searchItemAsync.then((value) => {
            if (value) {
                const searchItem = JSON.parse(value);

                if (searchItem.includes(textValue)) {
                    searchItem.splice(searchItem.indexOf(textValue), 1);
                }
                if (textValue === '') {
                    refetch();
                    return;
                }
                searchItem.push(textValue);
                AsyncStorage.setItem('searchItem', JSON.stringify(searchItem));
                setSearchValue(textValue);
                refetch();
            } else {
                AsyncStorage.setItem('searchItem', JSON.stringify([textValue]));
                setSearchValue(textValue);
                refetch();
            }
        });
    };

    return (
        <ContainerComponent
            title="Hoạt động"
            iconLeft="back"
            handleRefresh={refetch}
            _refreshing={isFetching}
            notification
        >
            <SpaceComponent height={16} />
            <SectionComponent>
                <SearchComponent
                    value={SearchValue}
                    onChangeText={setSearchValue}
                    onSubmit={handleSubmit}
                    onClear={() => setSearchValue('')}
                    placeholder="Tìm kiếm hoạt động"
                />
            </SectionComponent>
            <SectionComponent
                className="flex-1"
                style={{
                    zIndex: -1,
                }}
            >
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={data?.pages.map((page) => page.posts).flat()}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
                    removeClippedSubviews={true}
                    initialNumToRender={10}
                    ListFooterComponent={() => (isFetchingNextPage ? <ActivityIndicator size={'large'} /> : null)}
                    onEndReachedThreshold={0.3}
                    onEndReached={loadMore}
                    ListHeaderComponent={() => (
                        <TextComponent
                            text="Hoạt động đang diễn ra"
                            className="text-[20px] text-primary-500 font-interMd mt-2 mb-4"
                        />
                    )}
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
                                    pathname: `/activity/${item.id}`,
                                });
                            }}
                        />
                    )}
                />
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
