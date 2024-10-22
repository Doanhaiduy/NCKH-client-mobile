import trainingPointAPI from '@/apis/trainingPointApi';
import userAPI from '@/apis/userApi';
import {
    ButtonComponent,
    ContainerComponent,
    DropDownComponent,
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
import React, { useState } from 'react';
import { View } from 'react-native';
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
            notification
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
                    <View className="w-[80%] justify-between items-center">
                        <View
                            className="justify-between items-center border-primary-300 border-[1px] w-[200px] aspect-square mb-10"
                            style={{
                                shadowColor: colors.primary300,
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                },
                                shadowOpacity: 0.6,
                                shadowRadius: 50,
                                elevation: 8,
                                backgroundColor: colors.white,
                                borderRadius: 99,
                            }}
                        >
                            <View
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    transform: [{ translateY: -40 }],
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <TextComponent
                                    text={data?.totalScore?.toString() || ''}
                                    size={96}
                                    color={colors.primary500}
                                    style={{
                                        lineHeight: 96,
                                        fontWeight: 'semibold',
                                    }}
                                />
                                <TextComponent
                                    text={data?.status || ''}
                                    size={20}
                                    color={colors.primary200}
                                    style={{
                                        textTransform: 'capitalize',
                                    }}
                                />
                            </View>
                        </View>
                        <ButtonComponent
                            iconFlex="right"
                            icon={<Ionicons name="arrow-forward" size={24} color={colors.white} />}
                            title="Xem chi tiết"
                            type="primary"
                            size="large"
                            onPress={() => router.push(`/training-point/${data?.id}`)}
                        />
                    </View>
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
