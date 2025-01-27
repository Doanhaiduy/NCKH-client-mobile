import trainingPointAPI from '@/apis/trainingPointApi';
import {
    ButtonComponent,
    ContainerComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TableBorderComponent,
    TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { authSelector } from '@/stores/reducers/authReducer';
import { romanize } from '@/utils';
import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { LoadingModal } from '@/modals';

export default function TrainingPointDetails() {
    const { id } = useLocalSearchParams();
    const { authData } = useSelector(authSelector);
    const { trainingPointRefresh } = useSelector((state: any) => state.refresh);
    const { data, error, refetch, isFetching, isRefetching } = useQuery({
        queryKey: ['training-points', id],
        queryFn: () => trainingPointAPI.getTrainingPointById(id?.toString() ?? ''),
    });

    useEffect(() => {
        if (trainingPointRefresh) {
            refetch();
        }
    }, [trainingPointRefresh]);

    return (
        <ContainerComponent
            title="Kết quả rèn luyện"
            iconLeft="back"
            isScroll
            handleRefresh={refetch}
            _refreshing={isRefetching}
            iconRight={
                <TouchableOpacity
                    onPress={() => {
                        if (data?.isLocked) {
                            Alert.alert('Thông báo', 'Chưa tới thời gian đánh giá điểm rèn luyện, hãy quay lại sau');
                        } else {
                            router.push({
                                pathname: '/training-point/upload',
                                params: { id },
                            });
                        }
                    }}
                >
                    <Feather name="upload" size={24} color={colors.primary400} />
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
                <SpaceComponent height={16} />
                <RowComponent>
                    <ButtonComponent
                        title="Tự đánh giá"
                        type="primary"
                        size="small"
                        onPress={() => {
                            if (data?.isLocked) {
                                Alert.alert(
                                    'Thông báo',
                                    'Chưa tới thời gian đánh giá điểm rèn luyện, hãy quay lại sau',
                                );
                            } else {
                                router.push({
                                    pathname: '/training-point/assessment',
                                    params: { id },
                                });
                            }
                        }}
                    />
                    <SpaceComponent width={10} />
                    <ButtonComponent
                        title="Tải minh chứng"
                        type="primary"
                        size="small"
                        onPress={() => {
                            if (data?.isLocked) {
                                Alert.alert(
                                    'Thông báo',
                                    'Chưa tới thời gian đánh giá điểm rèn luyện, hãy quay lại sau',
                                );
                            } else {
                                router.push({
                                    pathname: '/training-point/upload',
                                    params: { id },
                                });
                            }
                        }}
                    />
                </RowComponent>
            </SectionComponent>
            <SectionComponent className="items-center">
                <TableBorderComponent data={data?.criteria} />
            </SectionComponent>
            <SpaceComponent height={40} />
            {isFetching && <LoadingModal />}
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
