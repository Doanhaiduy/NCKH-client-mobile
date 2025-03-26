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
import { Alert, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useRefreshing } from '@/hooks/useRefreshing';
import { useTranslation } from 'react-i18next';

export default function Upload() {
    const { t } = useTranslation();
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

    return (
        <ContainerComponent
            title={t('upload.title')}
            iconLeft='back'
            isScroll
            handleRefresh={handleRefresh}
            _refreshing={refreshing}
            iconRight={
                <TouchableOpacity
                    onPress={() =>
                        Alert.alert(t('upload.notification_title'), t('upload.confirm_message'), [
                            {
                                text: t('upload.cancel_button'),
                                style: 'cancel',
                            },
                            {
                                text: t('upload.agree_button'),
                                onPress: () => {
                                    router.back();
                                },
                            },
                        ])
                    }
                >
                    <TextComponent text={t('upload.submit_button')} size={20} color={colors.primary400} />
                </TouchableOpacity>
            }
        >
            <SectionComponent className='items-center justify-center'>
                <SpaceComponent height={16} />
                <TextComponent
                    text={t('upload.student_id_label').replace('{username}', authData?.username || '')}
                    className='font-interMd'
                    size={20}
                />
                <TextComponent
                    text={t('upload.student_name_label').replace('{fullName}', authData?.fullName || '')}
                    className='font-interMd mt-2'
                    size={20}
                    center
                />
                <TextComponent
                    text={t('upload.semester_year_label')
                        .replace('{year}', data?.semesterYear.year.toString() || '')
                        .replace('{nextYear}', (+data?.semesterYear.year! + 1).toString())
                        .replace('{semester}', romanize(data?.semesterYear.semester.toString()!))}
                    color={colors.text400}
                    className='mt-2'
                    size={16}
                />
            </SectionComponent>
            <SectionComponent className='items-center'>
                <TableBorderComponent isUpload data={data?.criteria} />
            </SectionComponent>
        </ContainerComponent>
    );
}
