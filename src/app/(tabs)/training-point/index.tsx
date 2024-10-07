import trainingPointAPI from '@/apis/trainingPointApi';
import userAPI from '@/apis/userApi';
import {
    ContainerComponent,
    DropDownComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { SemesterData, YearData } from '@/mockData';
import { LoadingModal } from '@/modals';
import { authSelector } from '@/stores/reducers/authReducer';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function TrainingPoint() {
    const [selectedYear, setSelectedYear] = useState<String>(YearData[3].value.toString());
    const [selectedSemester, setSelectedSemester] = useState<String>(SemesterData[0].value.toString());
    const { authData } = useSelector(authSelector);

    const { data, refetch, isFetching } = useQuery<TrainingPoint>({
        queryKey: ['training-point', selectedYear, selectedSemester, authData?.id],
        queryFn: () =>
            userAPI
                .getTrainingPoints(authData?.id!, {
                    year: +selectedYear.split('-')[0],
                    semester: +selectedSemester as 1 | 2,
                })
                .then((res) => {
                    if (res) {
                        return res;
                    }
                    return {} as TrainingPoint;
                }),
    });

    console.log(data);

    return (
        <ContainerComponent
            title="Kết quả rèn luyện"
            iconLeft="back"
            search
            isScroll
            handleRefresh={refetch}
            _refreshing={isFetching}
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
            </SectionComponent>
            <SpaceComponent height={16} />
            <SectionComponent className="flex-row justify-center flex-wrap">
                <DropDownComponent
                    data={YearData}
                    title="Năm học"
                    onSelect={(selectedItem, index) => {
                        setSelectedYear(selectedItem.value);
                    }}
                />
                <SpaceComponent width={10} />
                <DropDownComponent
                    data={SemesterData}
                    title="Học kỳ"
                    width={70}
                    onSelect={(selectedItem, index) => {
                        setSelectedSemester(selectedItem.value);
                    }}
                />
            </SectionComponent>
            <SectionComponent className="items-center w-full">
                <SpaceComponent height={16} />
                {data?.id ? (
                    <TouchableOpacity
                        className="flex-row px-2 py-4 bg-text-100 rounded-[10px] mt-4 items-center w-full"
                        onPress={() => router.push(`/training-point/${data.id}`)}
                    >
                        <RowComponent className="flex-1 gap-2">
                            <Ionicons name="bookmark" size={32} color={colors.primary400} />
                            <View className="px-2 py-1 rounded-[6px] bg-primary-400">
                                <TextComponent size={12} color={colors.white} text={data.status} />
                            </View>
                            <TextComponent text="Điểm rèn luyện hiện tại" />
                        </RowComponent>
                        <TextComponent text={data?.totalScore?.toString()} />
                        <Ionicons name="chevron-forward" size={24} color={colors.text200} />
                    </TouchableOpacity>
                ) : (
                    <View className="px-2 py-4">
                        <TextComponent text="Không có dữ liệu" />
                    </View>
                )}
            </SectionComponent>
            <LoadingModal visible={isFetching} />
        </ContainerComponent>
    );
}
