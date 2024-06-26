import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import {
    ButtonComponent,
    ContainerComponent,
    DropDownComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import SelectDropdown from 'react-native-select-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';

const YearData = [
    { title: '2021-2022', value: '2021-2022' },
    { title: '2022-2023', value: '2022-2023' },
    { title: '2023-2024', value: '2023-2024' },
    { title: '2024-2025', value: '2024-2025' },
];

const SemesterData = [
    { title: '1', value: '1' },
    { title: '2', value: '2' },
];

export default function TrainingPoint() {
    const [selectedYear, setSelectedYear] = useState<String>(YearData[0].value.toString());
    const [selectedSemester, setSelectedSemester] = useState<String>(SemesterData[0].value.toString());

    return (
        <ContainerComponent title="Kết quả rèn luyện" iconLeft="back" search>
            <SectionComponent className="items-center">
                <SpaceComponent height={16} />
                <TextComponent text="Mã sinh viên: 63123456" className="font-interMd" size={20} />
                <TextComponent text="Tên sinh viên: Nguyễn Trà My" className="font-interMd mt-2" size={20} />
            </SectionComponent>
            <SpaceComponent height={16} />
            <SectionComponent className="flex-row justify-center flex-wrap">
                <DropDownComponent
                    data={YearData}
                    title="Năm học"
                    onSelect={(selectedItem, index) => {
                        setSelectedYear(selectedItem.value);
                        console.log(selectedItem.value);
                    }}
                />
                <SpaceComponent width={10} />
                <DropDownComponent
                    data={SemesterData}
                    title="Năm học"
                    width={70}
                    onSelect={(selectedItem, index) => {
                        setSelectedSemester(selectedItem.value);
                        console.log(selectedItem.value);
                    }}
                />
            </SectionComponent>
            <SectionComponent className="items-center">
                <ButtonComponent title="Xem kết quả" onPress={() => {}} type="primary" size="medium" />

                <TouchableOpacity
                    className="flex-row px-2 py-4 bg-text-600 rounded-[10px] mt-4 items-center"
                    onPress={() => router.push('training-point/2')}
                >
                    <RowComponent className="flex-1 gap-2">
                        <Ionicons name="bookmark" size={32} color={colors.primary400} />
                        <TextComponent text="Điểm rèn luyện hiện tại" />
                    </RowComponent>
                    <TextComponent text="75" />
                    <Ionicons name="chevron-forward" size={24} color={colors.text400} />
                </TouchableOpacity>
            </SectionComponent>
        </ContainerComponent>
    );
}
