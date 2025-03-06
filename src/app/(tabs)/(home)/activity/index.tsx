import postAPI from '@/apis/postApi';
import {
    ContainerComponent,
    ItemCardList,
    SearchComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { useDebounce } from '@/hooks/useDebounce';
import { useRefreshing } from '@/hooks/useRefreshing';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Platform, RefreshControl, StyleSheet, View } from 'react-native';

export default function ActivityScreen() {
    const [searchValue, setSearchValue] = React.useState('');
    const debouncedSearchValue = useDebounce(searchValue, 500);
    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch } =
        useInfiniteQuery({
            queryKey: ['activity', debouncedSearchValue],
            initialPageParam: 1,
            queryFn: ({ pageParam }) =>
                postAPI.getPosts({
                    page: pageParam,
                    size: 10,
                    type: 'activity',
                    search: debouncedSearchValue,
                    sortDate: 'desc',
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

    const { refreshing, handleRefresh } = useRefreshing(refetch);

    React.useEffect(() => {
        refetch();
    }, [debouncedSearchValue]);

    return (
        <ContainerComponent title='Hoạt động' iconLeft='back' notification>
            <SpaceComponent height={16} />
            <SectionComponent>
                <SearchComponent
                    value={searchValue}
                    onChangeText={setSearchValue}
                    onClear={() => setSearchValue('')}
                    placeholder='Tìm kiếm hoạt động'
                />
            </SectionComponent>
            <SectionComponent
                className='flex-1'
                style={{
                    zIndex: Platform.OS === 'ios' ? -1 : 0,
                }}
            >
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={data?.pages.map((page) => page.posts).flat()}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                    removeClippedSubviews={true}
                    ListEmptyComponent={() => (
                        <TextComponent text='Không có dữ liệu' className='text-center text-text-200' />
                    )}
                    initialNumToRender={10}
                    ListFooterComponent={() => (isFetchingNextPage ? <ActivityIndicator size={'large'} /> : null)}
                    onEndReachedThreshold={0.3}
                    onEndReached={loadMore}
                    ListHeaderComponent={() => (
                        <TextComponent
                            text='Hoạt động đang diễn ra'
                            className='text-[20px] text-primary-500 font-interMd mt-2 mb-4'
                        />
                    )}
                    renderItem={({ item }) => (
                        <ItemCardList
                            data={item}
                            onPress={() => {
                                router.push({
                                    pathname: `/activity/${item._id}`,
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
