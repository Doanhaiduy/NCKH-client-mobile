import postAPI from '@/apis/postApi';
import {
    ActionListComponents,
    ContainerComponent,
    PortalizeComponent,
    SectionComponent,
    SlideCardComponent,
    TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Feather } from '@expo/vector-icons';
import { useQueries } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Section {
    title: string;
    content: string | string[];
}

export default function Home() {
    const modalizeRef = React.useRef<any>(null);
    const { expoPushToken, notification } = usePushNotifications();
    const [posts] = useQueries({
        queries: [
            {
                queryKey: ['posts-activity'],
                queryFn: () =>
                    postAPI.getPosts({
                        page: 1,
                        size: 4,
                        type: 'activity',
                        sortDate: 'desc',
                    }),
                refetchInterval: 60000,
            },
        ],
    });

    return (
        <ContainerComponent
            isScroll
            title='NTU Student'
            isHome
            _refreshing={posts.isFetching}
            handleRefresh={() => {
                posts.refetch();
            }}
            iconRight={
                <TouchableOpacity onPress={() => router.push('/notification')}>
                    <Feather name='bell' size={32} color={colors.primary500} />
                </TouchableOpacity>
            }
        >
            <StatusBar barStyle={'light-content'} />
            <SectionComponent className='flex-1 w-full'>
                <TextComponent text='Hoạt động nổi bật' fontBold color={colors.primary500} />

                <View className='pt-4 w-full -ml-1'>
                    <SlideCardComponent data={posts.data?.posts || []} autoPlay duration={4000} />
                </View>
            </SectionComponent>
            <SectionComponent className='flex-1'>
                <TextComponent text='Truy cập nhanh' fontBold />
                <ActionListComponents
                    onShowAll={() => {
                        modalizeRef.current?.open();
                    }}
                />
            </SectionComponent>

            <PortalizeComponent
                ref={modalizeRef}
                children={
                    <View className='shadow-xl gap-5 p-3 pt-4 bg-white mx-auto'>
                        <TextComponent text='Truy cập nhanh' fontBold />
                        <ActionListComponents
                            full
                            onClose={() => {
                                modalizeRef.current?.close();
                            }}
                        />
                    </View>
                }
            />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
