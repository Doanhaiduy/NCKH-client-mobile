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
import { useRefreshing } from '@/hooks/useRefreshing';
import { SemesterData, YearData } from '@/mockData';
import { LoadingModal } from '@/modals';
import { authSelector } from '@/stores/reducers/authReducer';
import { setTrainingPointRefresh } from '@/stores/reducers/refreshReducer';
import { getSemesterYears } from '@/utils';
import { dateTimeFormat } from '@/utils/dateTime';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function TrainingPoint() {
    const [selectedYear, setSelectedYear] = useState<String>(YearData[3].value.toString());
    const [selectedSemester, setSelectedSemester] = useState<String>(SemesterData[0].value.toString());
    const [trainingPointOption, setTrainingPointOption] = useState<{
        year: Year[];
        semester: Semester[];
    }>();
    const { authData } = useSelector(authSelector);
    const { trainingPointRefresh } = useSelector((state: any) => state.refresh);

    const dispatch = useDispatch();

    const { data, refetch, isFetching } = useQuery<TrainingPoint>({
        queryKey: ['training-point', selectedYear, selectedSemester, authData?._id],
        queryFn: () =>
            userAPI
                .getTrainingPoints(authData?._id!, {
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

    const { refreshing, handleRefresh } = useRefreshing(refetch);

    useEffect(() => {
        const optionData = getSemesterYears(authData?.username!);
        setTrainingPointOption({
            year: optionData.YearOptionData,
            semester: optionData.SemesterOptionData,
        });
    }, [authData?.username]);

    useEffect(() => {
        if (trainingPointRefresh) {
            refetch();
            dispatch(setTrainingPointRefresh(false));
        }
    }, [trainingPointRefresh]);
    return (
        <ContainerComponent
            title="Kết quả rèn luyện"
            iconLeft="back"
            notification
            isScroll
            handleRefresh={handleRefresh}
            _refreshing={refreshing}
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
                    data={trainingPointOption?.year || []}
                    title="Năm học"
                    onSelect={(selectedItem, index) => {
                        setSelectedYear(selectedItem.value as string);
                    }}
                />
                <SpaceComponent width={10} />
                <DropDownComponent
                    data={trainingPointOption?.semester || []}
                    title="Học kỳ"
                    width={70}
                    onSelect={(selectedItem, index) => {
                        setSelectedSemester(selectedItem.value as string);
                    }}
                />
            </SectionComponent>
            <SectionComponent className="items-center w-full">
                <SpaceComponent height={16} />
                {data?._id ? (
                    <View className="w-[80%] justify-between items-center">
                        <View
                            className="absolute -top-6 -right-10 bg-white  p-4 py-2 shadow-lg  justify-center items-center border-primary-300 border-[1px]"
                            style={{
                                zIndex: 999,
                                borderRadius: 32,
                                borderBottomLeftRadius: 0,
                            }}
                        >
                            <TextComponent
                                text="Điểm tự đánh giá"
                                size={14}
                                color={colors.primary400}
                                className="font-semibold"
                            />
                            <TextComponent
                                text={data.tempScore.toString()}
                                color={colors.primary400}
                                className="mt-2 font-semibold"
                                size={24}
                            />
                        </View>
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
                            onPress={() => router.push(`/training-point/${data?._id}`)}
                        />
                    </View>
                ) : (
                    <View className="px-2 py-4">
                        <TextComponent text="Không có dữ liệu" className="text-center text-text-200" />
                    </View>
                )}
            </SectionComponent>
            <SectionComponent>
                <View
                    className="flex-row  bg-primary-100 p-4 flex-1 w-full justify-around"
                    style={{
                        borderRadius: 24,
                    }}
                >
                    <View>
                        <TextComponent
                            text="Thời gian tự đánh giá"
                            size={20}
                            color={colors.primary400}
                            className="font-interSemi"
                        />
                        <SpaceComponent height={10} />
                        {data?.AssessmentStartTime && data.AssessmentEndTime ? (
                            <>
                                <TextComponent
                                    color={colors.error}
                                    fontBold
                                    text={`Từ: ${dateTimeFormat(data?.AssessmentStartTime!)}`}
                                />
                                <TextComponent
                                    color={colors.error}
                                    fontBold
                                    text={`Đến: ${dateTimeFormat(data?.AssessmentEndTime!)}`}
                                />
                            </>
                        ) : (
                            <TextComponent color={colors.error} fontBold text="Chưa đến thời gian đánh giá" />
                        )}
                    </View>
                    <View className="rotate-12">
                        <MaterialCommunityIcons name="timer-sand" size={80} color={colors.primary500} />
                    </View>
                </View>
            </SectionComponent>
            {isFetching && <LoadingModal />}
        </ContainerComponent>
    );
}
