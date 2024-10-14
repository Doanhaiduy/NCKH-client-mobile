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
import { AttendanceOptionData } from '@/mockData';
import { authSelector } from '@/stores/reducers/authReducer';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function ListAttendance() {
    const { authData } = useSelector(authSelector);
    const { back } = useLocalSearchParams();

    const { data, refetch, isFetching } = useQuery({
        queryKey: ['attendance-list', authData?.id],
        queryFn: () =>
            userAPI.getAttendances(authData?.id!, {
                page: 1,
                size: 10,
            }),
    });

    useEffect(() => {
        refetch();
        console.log(back);
    }, []);

    return (
        <ContainerComponent
            onBack={() => {
                back === 'to_home' && router.navigate('/(home)');
                back === 'to_attendance' && router.back();
                back === 'to_scan' && router.dismissAll();
            }}
            isScroll
            title="Đã điểm danh"
            handleRefresh={refetch}
            _refreshing={isFetching}
            iconLeft="back"
            notification
        >
            <SectionComponent className="items-center">
                <TextComponent
                    text="Hoạt động đã tham gia"
                    className="mt-2 mb-6 font-interMd"
                    size={20}
                    color={colors.primary400}
                />
                <RowComponent className="ml-auto mb-4">
                    <DropDownComponent title="" data={AttendanceOptionData} onSelect={() => {}} width={230} />
                </RowComponent>
                <TableComponent data={data?.attendances.reverse() || []} />
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
