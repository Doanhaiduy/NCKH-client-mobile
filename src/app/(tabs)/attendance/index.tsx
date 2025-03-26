import eventAPI from '@/apis/eventApi';
import { ButtonComponent, ContainerComponent, ItemCardList, SectionComponent, TextComponent } from '@/components';
import { resetRefreshEventFlag } from '@/stores/reducers/refreshReducer';
import { useQueries } from '@tanstack/react-query';
import { router, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function Attendance() {
    const navigation = useNavigation();
    const { eventNeedsRefresh } = useSelector((state: any) => state.refresh);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [eventActive, eventInactive, eventRegistered] = useQueries({
        queries: [
            {
                queryKey: ['events-ongoing'],
                queryFn: () =>
                    eventAPI.getEvents({
                        page: 1,
                        size: 10,
                        status: 'active',
                        time: 'ongoing',
                        typeEvent: 'mandatory',
                    }),
                refetchInterval: 60000,
            },
            {
                queryKey: ['events-past'],
                queryFn: () =>
                    eventAPI.getEvents({
                        page: 1,
                        size: 10,
                        status: 'active',
                        time: 'past',
                    }),
                refetchInterval: 60000,
            },
            {
                queryKey: ['events-registered'],
                queryFn: () =>
                    eventAPI.getEvents({
                        page: 1,
                        size: 10,
                        status: 'active',
                        time: 'ongoing',
                        typeEvent: 'optional',
                    }),
                refetchInterval: 60000,
            },
        ],
    });

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            navigation.dispatch(e.data.action);
        });
    }, []);

    useEffect(() => {
        if (eventNeedsRefresh) {
            eventActive.refetch();
            eventInactive.refetch();
            eventRegistered.refetch();
            dispatch(resetRefreshEventFlag());
        }
    }, [eventNeedsRefresh, dispatch, eventActive, eventInactive, eventRegistered]);

    return (
        <ContainerComponent
            iconLeft='logo'
            title={t('attendance.title')}
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
                    text={t('attendance.ongoing_activities')}
                    className='text-[20px] text-primary-500 font-interMd mt-2 mb-4'
                />
                <View className='w-full'>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={() => (
                            <TextComponent text={t('attendance.no_data')} className='text-center text-text-200' />
                        )}
                        data={eventActive?.data?.events}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={item}
                                onPressButton={() => {
                                    router.push(`/attendance/${item._id}`);
                                }}
                                isAction
                            />
                        )}
                    />
                </View>
            </SectionComponent>

            <SectionComponent className='border-t-[1px] border-text-200 flex-1'>
                <TextComponent
                    text={t('attendance.registered_activities')}
                    className='text-[20px] text-primary-500 font-interMd mt-2 mb-4'
                />
                <View className='w-full'>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={eventRegistered.data?.events}
                        ListEmptyComponent={() => (
                            <TextComponent text={t('attendance.no_data')} className='text-center text-text-200' />
                        )}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={item}
                                onPress={() => {
                                    router.push(`/activity/${item.post}`);
                                }}
                                onPressButton={() => {
                                    router.push(`/attendance/${item._id}`);
                                }}
                                isAction
                            />
                        )}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className='border-t-[1px] border-text-200 flex-1'>
                <TextComponent
                    text={t('attendance.past_activities')}
                    className='text-[20px] text-primary-500 font-interMd mt-2 mb-4'
                />
                <View className='w-full'>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={eventInactive.data?.events}
                        ListEmptyComponent={() => (
                            <TextComponent text={t('attendance.no_data')} className='text-center text-text-200' />
                        )}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => <ItemCardList data={item} />}
                    />
                </View>
            </SectionComponent>
            <View className='w-[80%] mx-auto py-5'>
                <ButtonComponent
                    title={t('attendance.view_attended_activities')}
                    size='large'
                    type='primary'
                    onPress={() => {
                        router.push({
                            pathname: '/attendance/list',
                            params: {
                                back: 'to_attendance',
                            },
                        });
                    }}
                />
            </View>
        </ContainerComponent>
    );
}
