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
            title="NTU Student"
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
                <TextComponent text="Hoạt động nổi bật" fontBold color={colors.primary500} />

                <View className="pt-4 w-full -ml-1">
                    <SlideCardComponent data={posts.data?.posts || []} autoPlay duration={4000} />
                </View>
            </SectionComponent>
            <SectionComponent className="flex-1">
                <TextComponent text="Truy cập nhanh" fontBold />
                <ActionListComponents />
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
