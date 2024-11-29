import eventAPI from '@/apis/eventApi';
import { ButtonComponent, ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { useRefreshing } from '@/hooks/useRefreshing';
import { dateTimeFormat } from '@/utils/dateTime';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function Details() {
    const { id } = useLocalSearchParams();

    const { data, refetch, isFetching } = useQuery({
        queryKey: ['event', id],
        queryFn: () => eventAPI.getDetailEvents(id?.toString() || ''),
    });

    const { refreshing, handleRefresh } = useRefreshing(refetch);

    console.log('data', data);

    return (
        <ContainerComponent
            iconLeft="back"
            notification
            title="Điểm Danh"
            isScroll
            _refreshing={refreshing}
            handleRefresh={handleRefresh}
        >
            <SectionComponent className="items-center">
                <TextComponent text={data?.name || ''} size={20} className="text-center mt-4" />
                <TextComponent text={'Mã sự kiện: ' + data?.eventCode || ''} size={16} className="text-center mt-2" />
                <TextComponent text={'Địa điểm: ' + data?.location.name || ''} size={16} className="text-center mt-2" />
                <TextComponent
                    text={`Thời gian bắt đầu: ${dateTimeFormat(data?.startAt || '')}`}
                    size={16}
                    color={colors.error}
                    className="text-center mt-2"
                />
                <TextComponent
                    text={`Thời gian kết thúc: ${dateTimeFormat(data?.endAt || '')}`}
                    size={16}
                    className="text-center mt-2"
                    color={colors.error}
                />
                <SpaceComponent height={40} />
                <Image source={require('@/assets/images/scanner.png')} className="w-[90%] h-[310px]" />
                <SpaceComponent height={40} />
            </SectionComponent>
            <SectionComponent className="items-center w-[80%] mx-auto">
                <ButtonComponent
                    title="Điểm danh"
                    type="primary"
                    size="large"
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
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
