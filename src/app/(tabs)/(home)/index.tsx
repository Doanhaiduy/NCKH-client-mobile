import postAPI from '@/apis/postApi';
import {
    ActionListComponents,
    ButtonComponent,
    ContainerComponent,
    ItemCardGrid,
    ItemCardList,
    RowComponent,
    SectionComponent,
    SlideCardComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { appInfo } from '@/constants/appInfo';
import { colors } from '@/constants/colors';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { EventData } from '@/mockData';
import { authSelector } from '@/stores/reducers/authReducer';
import { Feather } from '@expo/vector-icons';
import { useQueries, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSelector } from 'react-redux';

export default function Home() {
    const { authData } = useSelector(authSelector);

    const { handleScroll } = useScrollAnimation();

    const [posts, news] = useQueries({
        queries: [
            {
                queryKey: ['posts-activity'],
                queryFn: () =>
                    postAPI.getPosts({
                        page: 1,
                        size: 4,
                        category: 'activity',
                    }),
            },
            {
                queryKey: ['posts-news'],
                queryFn: () =>
                    postAPI.getPosts({
                        page: 1,
                        size: 6,
                        category: 'news',
                    }),
            },
        ],
    });

    return (
        <ContainerComponent
            isScroll
            title="Trang chủ"
            isHome
            _refreshing={posts.isFetching || news.isFetching}
            handleRefresh={() => {
                posts.refetch();
                news.refetch();
            }}
            iconRight={
                <TouchableOpacity onPress={() => router.push('/notification')}>
                    <Feather name="bell" size={32} color={colors.primary500} />
                </TouchableOpacity>
            }
        >
            <StatusBar barStyle={'light-content'} />
            <SectionComponent className="flex-1 w-full">
                <TextComponent text="Hoạt động nổi bật" fontBold />

                <View className="pt-4 w-full  -ml-1">
                    <SlideCardComponent data={posts.data?.posts || []} autoPlay duration={4000} />
                </View>
            </SectionComponent>
            <SectionComponent className="pt-4">
                <TextComponent text="Truy cập nhanh" fontBold />
                <ActionListComponents />
                {/* <ActionListComponents /> */}
                {/* <TextComponent
                    text='Hoạt động nổi bật'
                    className='text-[20px] text-primary-500 font-interMd mt-2 mb-4'
                />

                <View className='flex-1'>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={posts?.data?.posts || []}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        numColumns={2}
                        ListFooterComponent={() => (
                            <View className='items-center'>
                                <SpaceComponent height={16} />
                                <ButtonComponent title='Xem thêm' size='small' type='primary' onPress={() => {}} />
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <ItemCardGrid
                                size='medium'
                                isShadow
                                data={item}
                                onPress={() => {
                                    router.push(`/events/${item.id}`);
                                }}
                            />
                        )}
                    />
                </View> */}
            </SectionComponent>

            {/* <SectionComponent className=''>
                <TextComponent text='Tin tức' className='text-[20px] text-primary-500 font-interMd mt-2 mb-4' />
                <View className='flex-1'>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={news?.data?.posts}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        ListFooterComponent={() => (
                            <View className='items-center'>
                                <SpaceComponent height={16} />
                                <ButtonComponent
                                    title='Xem thêm'
                                    size='small'
                                    type='primary'
                                    onPress={() => {
                                        router.push('/news');
                                    }}
                                />
                            </View>
                        )}
                        renderItem={({ item }) => <ItemCardList data={item} onPress={() => {}} />}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className='border-b-[0.4px]'>
                <TextComponent
                    text='Hoạt động đang diễn ra'
                    className='text-[20px] text-primary-500 font-interMd mt-2 mb-4'
                />
                <ItemCardGrid size='large' data={posts?.data?.posts[0] || EventData[0]} onPress={() => {}} />
                <View className='flex-1'>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={posts?.data?.posts}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        numColumns={2}
                        ListFooterComponent={() => (
                            <View className='items-center'>
                                <SpaceComponent height={16} />
                                <ButtonComponent
                                    title='Xem thêm'
                                    size='small'
                                    type='primary'
                                    onPress={() => {
                                        router.push('/ongoing-events');
                                    }}
                                />
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <ItemCardGrid isShadow size='medium' data={item} onPress={() => {}} />
                        )}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className=''>
                <TextComponent
                    text='Hoạt động đã diễn ra'
                    className='text-[20px] text-primary-500 font-interMd mt-2 mb-4'
                />
                <View className='flex-1'>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={posts?.data?.posts}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        ListFooterComponent={() => (
                            <View className='items-center'>
                                <SpaceComponent height={16} />
                                <ButtonComponent
                                    title='Xem thêm'
                                    size='small'
                                    type='primary'
                                    onPress={() => {
                                        router.push('/finished-events');
                                    }}
                                />
                            </View>
                        )}
                        renderItem={({ item }) => <ItemCardList data={item} onPress={() => {}} />}
                    />
                </View>
            </SectionComponent> */}
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
