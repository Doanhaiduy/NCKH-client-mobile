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
import React from 'react';
import { StyleSheet } from 'react-native';

export default function ListAttendance() {
    return (
        <ContainerComponent isScroll title="Đã điểm danh" iconLeft="back" search>
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
                <TableComponent />
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
