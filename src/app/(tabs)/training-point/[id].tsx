import trainingPointAPI from '@/apis/trainingPointApi';
import {
    ButtonComponent,
    ContainerComponent,
    SectionComponent,
    SpaceComponent,
    TableBorderComponent,
    TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { LoadingModal } from '@/modals';
import { authSelector } from '@/stores/reducers/authReducer';
import { romanize } from '@/utils';
import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

export default function TrainingPointDetails() {
    const { id } = useLocalSearchParams();
    const { authData } = useSelector(authSelector);
    const { data, error, refetch, isFetching } = useQuery({
        queryKey: ['training-points', id],
        queryFn: () => trainingPointAPI.getTrainingPointById(id?.toString() ?? ''),
    });

    return (
        <ContainerComponent
            title="Chi tiết kết quả rèn luyện"
            iconLeft="back"
            isScroll
            handleRefresh={refetch}
            _refreshing={isFetching}
            iconRight={
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: '/training-point/upload',
                            params: { id },
                        })
                    }
                >
                    <Feather name="upload" size={24} color={colors.primary400} />
                </TouchableOpacity>
            }
        >
            <SectionComponent className="items-center">
                <SpaceComponent height={16} />
                <TextComponent text={`Mã sinh viên: ${authData?.username}`} className="font-interMd" size={20} />
                <TextComponent text={`Tên sinh viên: ${authData?.fullName}`} className="font-interMd mt-2" size={20} />
                <TextComponent
                    text={`Năm học ${data?.year} - ${+data?.year! + 1} | Học Kỳ ${romanize(data?.semester.toString()!)}`}
                    color={colors.text400}
                    className="mt-2"
                    size={16}
                />
            </SectionComponent>
            <SectionComponent className="items-center">
                <TableBorderComponent data={data?.criteria} />
                <SpaceComponent height={40} />
                <ButtonComponent
                    title="Tải lên minh chứng"
                    type="outline"
                    size="large"
                    onPress={() =>
                        router.push({
                            pathname: '/training-point/upload',
                            params: { id },
                        })
                    }
                />
            </SectionComponent>
            <LoadingModal visible={isFetching} />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
