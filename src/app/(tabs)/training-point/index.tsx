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
import { useTranslation } from 'react-i18next';

export default function TrainingPoint() {
    const { t } = useTranslation();
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
            title={t('training_point.title')}
            iconLeft='back'
            notification
            isScroll
            handleRefresh={handleRefresh}
            _refreshing={refreshing}
        >
            <SectionComponent className='items-center justify-center'>
                <SpaceComponent height={16} />
                <TextComponent
                    text={t('training_point.student_id_label').replace('{username}', authData?.username || '')}
                    className='font-interMd'
                    size={20}
                />
                <TextComponent
                    text={t('training_point.student_name_label').replace('{fullName}', authData?.fullName || '')}
                    className='font-interMd mt-2'
                    size={20}
                    center
                />
            </SectionComponent>
            <SpaceComponent height={16} />
            <SectionComponent className='flex-row justify-center flex-wrap'>
                <DropDownComponent
                    data={trainingPointOption?.year || []}
                    title={t('training_point.year_label')}
                    onSelect={(selectedItem, index) => {
                        setSelectedYear(selectedItem.value as string);
                    }}
                />
                <SpaceComponent width={10} />
                <DropDownComponent
                    data={trainingPointOption?.semester || []}
                    title={t('training_point.semester_label')}
                    width={70}
                    onSelect={(selectedItem, index) => {
                        setSelectedSemester(selectedItem.value as string);
                    }}
                />
            </SectionComponent>
            <SectionComponent className='items-center w-full'>
                <SpaceComponent height={16} />
                {data?._id ? (
                    <View className='w-[80%] justify-between items-center'>
                        <View
                            className='absolute -top-6 -right-10 bg-white p-4 py-2 shadow-lg justify-center items-center border-primary-300 border-[1px]'
                            style={{
                                zIndex: 999,
                                borderRadius: 32,
                                borderBottomLeftRadius: 0,
                            }}
                        >
                            <TextComponent
                                text={t('training_point.self_assessment_score')}
                                size={14}
                                color={colors.primary400}
                                className='font-semibold'
                            />
                            <TextComponent
                                text={data.tempScore.toString()}
                                color={colors.primary400}
                                className='mt-2 font-semibold'
                                size={24}
                            />
                        </View>
                        <View
                            className='justify-between items-center border-primary-300 border-[1px] w-[200px] aspect-square mb-10'
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
                            iconFlex='right'
                            icon={<Ionicons name='arrow-forward' size={24} color={colors.white} />}
                            title={t('training_point.view_details_button')}
                            type='primary'
                            size='large'
                            onPress={() => router.push(`/training-point/${data?._id}`)}
                        />
                    </View>
                ) : (
                    <View className='px-2 py-4'>
                        <TextComponent text={t('training_point.no_data')} className='text-center text-text-200' />
                    </View>
                )}
            </SectionComponent>
            <SectionComponent>
                <View
                    className='flex-row bg-primary-100 p-4 flex-1 w-full justify-around'
                    style={{
                        borderRadius: 24,
                    }}
                >
                    <View>
                        <TextComponent
                            text={t('training_point.self_assessment_time_label')}
                            size={20}
                            color={colors.primary400}
                            className='font-interSemi'
                        />
                        <SpaceComponent height={10} />
                        {data?.AssessmentStartTime && data.AssessmentEndTime ? (
                            <>
                                <TextComponent
                                    color={colors.error}
                                    fontBold
                                    text={t('training_point.from_label').replace(
                                        '{startTime}',
                                        dateTimeFormat(data?.AssessmentStartTime!),
                                    )}
                                />
                                <TextComponent
                                    color={colors.error}
                                    fontBold
                                    text={t('training_point.to_label').replace(
                                        '{endTime}',
                                        dateTimeFormat(data?.AssessmentEndTime!),
                                    )}
                                />
                            </>
                        ) : (
                            <TextComponent color={colors.error} fontBold text={t('training_point.not_yet_time')} />
                        )}
                    </View>
                    <View className='rotate-12'>
                        <MaterialCommunityIcons name='timer-sand' size={80} color={colors.primary500} />
                    </View>
                </View>
            </SectionComponent>
            {isFetching && <LoadingModal />}
        </ContainerComponent>
    );
}
