import userAPI from '@/apis/userApi';
import {
    ContainerComponent,
    DropDownComponent,
    RowComponent,
    SectionComponent,
    TableComponent,
    TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { useRefreshing } from '@/hooks/useRefreshing';
import { authSelector } from '@/stores/reducers/authReducer';
import { getCurrentSemesterYear, getSemesterYears } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function ListAttendance() {
    const { authData } = useSelector(authSelector);
    const { back } = useLocalSearchParams();
    const [semesterYear, setSemesterYear] = React.useState<AttendanceOption[]>();
    const [selectedSemesterYear, setSelectedSemesterYear] = React.useState<{
        year: string;
        semester: string;
    }>(() => {
        const currentSY = getCurrentSemesterYear();
        return {
            year: currentSY.year.toString(),
            semester: currentSY.semester.toString(),
        };
    });
    const { t } = useTranslation();

    const { data, refetch, isFetching } = useQuery({
        queryKey: ['attendance-list', authData?._id, selectedSemesterYear],
        queryFn: () => {
            return userAPI.getAttendances(authData?._id!, {
                page: 1,
                size: 10,
                year: selectedSemesterYear?.year,
                semester: selectedSemesterYear?.semester,
            });
        },
        refetchInterval: 60000,
    });

    const { refreshing, handleRefresh } = useRefreshing(refetch);

    useEffect(() => {
        refetch();
        console.log(back);
    }, []);

    useEffect(() => {
        const optionData = getSemesterYears(authData?.username!);
        setSemesterYear(optionData.AttendanceOptionData);
    }, [authData?.username]);

    return (
        <ContainerComponent
            onBack={() => {
                back === 'to_home' && router.navigate('/(home)');
                back === 'to_attendance' && router.back();
                back === 'to_scan' && router.dismissAll();
            }}
            isScroll
            title={t('list_attendance.title')}
            handleRefresh={handleRefresh}
            _refreshing={refreshing}
            iconLeft='back'
            notification
        >
            <SectionComponent className='items-center'>
                <TextComponent
                    text={t('list_attendance.attended_activities')}
                    className='mt-2 mb-6 font-interMd'
                    size={20}
                    color={colors.primary400}
                />
                <RowComponent className='ml-auto mb-4'>
                    <DropDownComponent
                        title=''
                        data={semesterYear || []}
                        onSelect={(selectedItem, index) => {
                            setSelectedSemesterYear(selectedItem.value as { year: string; semester: string });
                        }}
                        width={230}
                    />
                </RowComponent>

                {data?.attendances?.length! > 0 ? (
                    <TableComponent data={data?.attendances.reverse() || []} />
                ) : (
                    <TextComponent text={t('list_attendance.no_data')} className='text-center text-text-200' />
                )}
            </SectionComponent>
            {/* {isFetching && <LoadingModal />} */}
        </ContainerComponent>
    );
}
