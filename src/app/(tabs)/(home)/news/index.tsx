import postAPI from "@/apis/postApi";
import {
    ContainerComponent,
    ItemCardList,
    SearchComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from "@/components";
import { useDebounce } from "@/hooks/useDebounce";
import { useRefreshing } from "@/hooks/useRefreshing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Platform, RefreshControl, StyleSheet, View } from "react-native";

export default function NewsScreen() {
    const [searchValue, setSearchValue] = React.useState("");
    const debouncedSearchValue = useDebounce(searchValue, 500);
    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch } =
        useInfiniteQuery({
            queryKey: ["news"],
            initialPageParam: 1,
            queryFn: ({ pageParam }) =>
                postAPI.getPosts({
                    page: pageParam,
                    size: 10,
                    category: "news",
                    search: debouncedSearchValue,
                }),
            getNextPageParam: (lastPage, pages) => {
                const nextPage = parseInt(lastPage.page) + 1;
                if (lastPage.next > 0) {
                    return lastPage.next > 0 ? nextPage : undefined;
                }
            },
        });

    const { refreshing, handleRefresh } = useRefreshing(refetch);

    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    useEffect(() => {
        refetch();
    }, [debouncedSearchValue]);

    return (
        <ContainerComponent title="Tin tức" iconLeft="back" notification>
            <SpaceComponent height={16} />
            <SectionComponent>
                <SearchComponent
                    value={searchValue}
                    onChangeText={setSearchValue}
                    onClear={() => setSearchValue("")}
                    placeholder="Tìm kiếm hoạt động"
                />
            </SectionComponent>
            <SectionComponent
                className="flex-1"
                style={{
                    zIndex: Platform.OS === "ios" ? -1 : 0,
                }}
            >
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={data?.pages.map((page) => page.posts).flat()}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                    removeClippedSubviews={true}
                    initialNumToRender={10}
                    ListFooterComponent={() => (isFetchingNextPage ? <ActivityIndicator size={"large"} /> : null)}
                    onEndReachedThreshold={0.3}
                    onEndReached={loadMore}
                    ListEmptyComponent={() => (
                        <TextComponent text="Không có dữ liệu" className="text-center text-text-200" />
                    )}
                    renderItem={({ item }) => (
                        <ItemCardList
                            data={item}
                            onPress={() => {
                                router.push({
                                    pathname: `/news/${item._id}`,
                                    params: {
                                        eventName: "Hoạt động ngoại khóa",
                                    },
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
