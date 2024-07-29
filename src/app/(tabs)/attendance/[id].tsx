import eventAPI from '@/apis/eventApi';
import { ButtonComponent, ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
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

    console.log(data?.data);
    return (
        <ContainerComponent
            iconLeft="back"
            search
            title="Điểm Danh"
            isScroll
            _refreshing={isFetching}
            handleRefresh={refetch}
        >
            <SectionComponent className="items-center ">
                <TextComponent text={data?.data.name || ''} size={20} className="text-center mt-4" />
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
                                eventCode: data?.data.eventCode,
                            },
                        });
                    }}
                />
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
