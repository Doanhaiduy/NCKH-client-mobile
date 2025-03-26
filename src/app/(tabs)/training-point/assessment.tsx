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
import React, { useEffect, useRef } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useRefreshing } from '@/hooks/useRefreshing';
import { LoadingModal } from '@/modals';
import { setTrainingPointRefresh } from '@/stores/reducers/refreshReducer';
import { useTranslation } from 'react-i18next';

export default function Assessment() {
    const { t } = useTranslation();
    const { id } = useLocalSearchParams();
    const { authData } = useSelector(authSelector);
    const [isLoading, setIsLoading] = React.useState(false);
    const dispatch = useDispatch();

    const { data, refetch, isFetching } = useQuery({
        queryKey: ['training-points', id],
        queryFn: () => trainingPointAPI.getTrainingPointById(id?.toString() ?? ''),
    });

    const { refreshing, handleRefresh } = useRefreshing(refetch);

    const isFocused = useIsFocused();
    const tableBorderRef = useRef(null);

    useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused]);

    return (
        <ContainerComponent
            title={t('assessment.title')}
            iconLeft='back'
            isScroll
            handleRefresh={handleRefresh}
            _refreshing={refreshing}
            iconRight={
                <TouchableOpacity
                    onPress={() =>
                        Alert.alert(t('assessment.notification_title'), t('assessment.confirm_message'), [
                            {
                                text: t('assessment.cancel_button'),
                                style: 'cancel',
                            },
                            {
                                text: t('assessment.agree_button'),
                                onPress: async () => {
                                    setIsLoading(true);
                                    if (tableBorderRef.current) {
                                        // @ts-ignore
                                        const updated = await tableBorderRef.current.handleSubmit();
                                        if (!updated) {
                                            return;
                                        }
                                    }
                                    dispatch(setTrainingPointRefresh(true));
                                    setIsLoading(false);
                                    router.back();
                                },
                            },
                        ])
                    }
                >
                    <TextComponent text={t('assessment.submit_button')} size={20} color={colors.primary400} />
                </TouchableOpacity>
            }
        >
            <SectionComponent className='items-center justify-center'>
                <SpaceComponent height={16} />
                <TextComponent
                    text={t('assessment.student_id_label').replace('{username}', authData?.username || '')}
                    className='font-interMd'
                    size={20}
                />
                <TextComponent
                    text={t('assessment.student_name_label').replace('{fullName}', authData?.fullName || '')}
                    className='font-interMd mt-2'
                    size={20}
                    center
                />
                <TextComponent
                    text={t('assessment.semester_year_label')
                        .replace('{year}', data?.semesterYear.year.toString() || '')
                        .replace('{nextYear}', (+data?.semesterYear.year! + 1).toString())
                        .replace('{semester}', romanize(data?.semesterYear.semester.toString()!))}
                    color={colors.text400}
                    className='mt-2'
                    size={16}
                />
            </SectionComponent>
            <SectionComponent className='items-center'>
                <TableBorderComponent
                    data={data?.criteria}
                    isAssessment
                    ref={tableBorderRef}
                    idTrainingPoint={data?._id ?? data?._id}
                />
            </SectionComponent>
            {isLoading && <LoadingModal message={t('assessment.processing_message')} />}
        </ContainerComponent>
    );
}
