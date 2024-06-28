import {
    ContainerComponent,
    SectionComponent,
    SpaceComponent,
    TableBorderComponent,
    TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

export default function Upload() {
    return (
        <ContainerComponent
            title="Tải lên minh chứng"
            iconLeft="back"
            isScroll
            iconRight={
                <TouchableOpacity
                    onPress={() =>
                        Alert.alert('Thông báo', 'Gửi minh chứng?', [
                            {
                                text: 'Hủy',
                                style: 'cancel',
                            },
                            {
                                text: 'Đồng ý',
                                onPress: () => {
                                    router.back();
                                    Alert.alert('Thông báo', 'Gửi thành công');
                                },
                            },
                        ])
                    }
                >
                    <TextComponent text="Gửi" size={20} color={colors.primary400} />
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
                <TableBorderComponent isUpload />
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
