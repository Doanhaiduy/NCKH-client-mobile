import {
    ButtonComponent,
    ContainerComponent,
    SectionComponent,
    SpaceComponent,
    TableBorderComponent,
    TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function TrainingPointDetails() {
    return (
        <ContainerComponent
            title="Chi tiết kết quả rèn luyện"
            iconLeft="back"
            isScroll
            iconRight={
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: '/training-point/upload',
                            params: { id: 1 },
                        })
                    }
                >
                    <Feather name="upload" size={24} color={colors.primary400} />
                </TouchableOpacity>
            }
        >
            <SectionComponent className="items-center">
                <SpaceComponent height={16} />
                <TextComponent text="Mã sinh viên: 63123456" className="font-interMd" size={20} />
                <TextComponent text="Tên sinh viên: Nguyễn Trà My" className="font-interMd mt-2" size={20} />
                <TextComponent text="Năm học 2023-2024 | Học Kỳ 2 " color={colors.text600} className="mt-2" size={16} />
            </SectionComponent>
            <SectionComponent className="items-center">
                <TableBorderComponent />
                <SpaceComponent height={40} />
                <ButtonComponent
                    title="Tải lên minh chứng"
                    type="outline"
                    size="large"
                    onPress={() =>
                        router.push({
                            pathname: '/training-point/upload',
                            params: { id: 1 },
                        })
                    }
                />
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
