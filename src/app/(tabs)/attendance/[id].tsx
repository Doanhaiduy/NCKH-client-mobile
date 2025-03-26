import eventAPI from '@/apis/eventApi';
import { ButtonComponent, ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { useRefreshing } from '@/hooks/useRefreshing';
import { dateTimeFormat } from '@/utils/dateTime';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function Details() {
    const { id } = useLocalSearchParams();
    const { t } = useTranslation();

    const { data, refetch } = useQuery({
        queryKey: ['event', id],
        queryFn: () => eventAPI.getDetailEvents(id?.toString() || ''),
        refetchInterval: 60000,
    });

    const { refreshing, handleRefresh } = useRefreshing(refetch);

    return (
        <ContainerComponent
            iconLeft='back'
            notification
            title={t('attendance_details.title')}
            isScroll
            _refreshing={refreshing}
            handleRefresh={handleRefresh}
        >
            {data ? (
                <>
                    <SectionComponent className='items-center'>
                        <TextComponent text={data?.name || ''} size={20} className='text-center mt-4' />
                        <TextComponent
                            text={t('attendance_details.event_code').replace('{code}', data?.eventCode || '')}
                            size={16}
                            className='text-center mt-2'
                        />
                        <TextComponent
                            text={t('attendance_details.location').replace('{location}', data?.location.name || '')}
                            size={16}
                            className='text-center mt-2'
                        />
                        <TextComponent
                            text={t('attendance_details.start_time').replace(
                                '{time}',
                                dateTimeFormat(data?.startAt || ''),
                            )}
                            size={16}
                            color={colors.error}
                            className='text-center mt-2'
                        />
                        <TextComponent
                            text={t('attendance_details.end_time').replace('{time}', dateTimeFormat(data?.endAt || ''))}
                            size={16}
                            className='text-center mt-2'
                            color={colors.error}
                        />
                        <SpaceComponent height={40} />
                        <Image source={require('@/assets/images/scanner.png')} className='w-[90%] h-[310px]' />
                        <SpaceComponent height={40} />
                    </SectionComponent>
                    <SectionComponent className='items-center w-[80%] mx-auto'>
                        <ButtonComponent
                            title={t('attendance_details.check_in')}
                            type='primary'
                            size='large'
                            onPress={() => {
                                router.push({
                                    pathname: '/attendance/scan',
                                    params: {
                                        id: id,
                                        eventCode: data?.eventCode,
                                    },
                                });
                            }}
                        />
                    </SectionComponent>
                </>
            ) : (
                <TextComponent text={t('attendance_details.no_event')} size={20} className='text-center mt-4' />
            )}
        </ContainerComponent>
    );
}
