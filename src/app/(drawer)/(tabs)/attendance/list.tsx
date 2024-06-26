import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
    ContainerComponent,
    DropDownComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TableComponent,
    TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

const AttendanceData = [
    {
        title: 'HK: I, NH: 2021 - 2022',
        value: 'HK: I, NH: 2021 - 2022',
    },
    {
        title: 'HK: II, NH: 2022 - 2023',
        value: 'HK: II, NH: 2022 - 2023',
    },

    {
        title: 'HK: I, NH: 2023 - 2024',
        value: 'HK: I, NH: 2023 - 2024',
    },
    {
        title: 'HK: II, NH: 2024 - 2025',
        value: 'HK: II, NH: 2024 - 2025',
    },
];

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
                    <DropDownComponent title="" data={AttendanceData} onSelect={() => {}} width={230} />
                </RowComponent>
                <TableComponent />
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
