import trainingPointAPI from '@/apis/trainingPointApi';
import {
    ContainerComponent,
    SectionComponent,
    SpaceComponent,
    TableBorderComponent,
    TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { authSelector } from '@/stores/reducers/authReducer';
import { romanize } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useRefreshing } from '@/hooks/useRefreshing';

export default function Upload() {
    const { id } = useLocalSearchParams();
    const { authData } = useSelector(authSelector);
    const { trainingPointRefresh } = useSelector((state: any) => state.refresh);

    const { data, refetch, isRefetching } = useQuery({
        queryKey: ['training-points', id],
        queryFn: () => trainingPointAPI.getTrainingPointById(id?.toString() ?? ''),
    });

    const { refreshing, handleRefresh } = useRefreshing(refetch);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (trainingPointRefresh) {
            refetch();
        }
    }, [trainingPointRefresh]);

    console.log(id);

    return (
        <ContainerComponent
            title="Tải lên minh chứng"
            iconLeft="back"
            isScroll
            handleRefresh={handleRefresh}
            _refreshing={refreshing}
            iconRight={
                <TouchableOpacity
                    onPress={() =>
                        Alert.alert('Thông báo', 'Gửi minh chứng?', [
                            {
                                text: 'Hủy',
                                style: 'cancel',
                            },
                            {
                                text: 'Đồng ý',
                                onPress: () => {
                                    router.back();
                                },
                            },
                        ])
                    }
                >
                    <TextComponent text="Gửi" size={20} color={colors.primary400} />
                </TouchableOpacity>
            }
        >
            <SectionComponent className="items-center justify-center">
                <SpaceComponent height={16} />
                <TextComponent text={`Mã sinh viên: ${authData?.username}`} className="font-interMd" size={20} />
                <TextComponent
                    text={`Tên sinh viên: ${authData?.fullName}`}
                    className="font-interMd mt-2"
                    size={20}
                    center
                />
                <TextComponent
                    text={`Năm học ${data?.semesterYear.year} - ${+data?.semesterYear.year! + 1} | Học Kỳ ${romanize(data?.semesterYear.semester.toString()!)}`}
                    color={colors.text400}
                    className="mt-2"
                    size={16}
                />
            </SectionComponent>
            <SectionComponent className="items-center">
                <TableBorderComponent isUpload data={data?.criteria} />
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
