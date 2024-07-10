import {
    ButtonComponent,
    ContainerComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function Details() {
    const { id, event, eventName } = useLocalSearchParams();

    return (
        <ContainerComponent iconLeft="back" title={eventName?.toString()} isScroll>
            <Image source={require('@/assets/images/TFT.jpg')} resizeMode="cover" className="w-full h-[260px]" />
            <SectionComponent className="flex-1 py-2">
                <RowComponent className="justify-between w-full">
                    <RowComponent>
                        <Ionicons name="calendar" size={14} color={colors.black} />
                        <TextComponent text="10/10/2021" className="text-[13px] text-text-400" />
                    </RowComponent>
                    {event === 'Đang diễn ra' && (
                        <ButtonComponent
                            title="Đăng ký"
                            size="small"
                            type="primary"
                            icon={<Ionicons name="add" size={20} color="white" />}
                            iconFlex="left"
                            onPress={() => {}}
                        />
                    )}
                </RowComponent>
                <SpaceComponent height={16} />
                <TextComponent
                    color={colors.primary300}
                    size={20}
                    text="THÔNG BÁO VỀ VIỆC ĐĂNG KÍ THAM GIA GIẢI BÓNG CHUYỀN NAM – NỮ khoa Công nghệ thông tin năm 2024"
                />
                <View className="pt-4 flex-col gap-3">
                    <TextComponent text="Đối tượng tham gia: sinh viên Khoa Công Nghệ Thông Tin" />
                    <TextComponent text="Thể lệ cuộc thi:  Mỗi đoàn Khoa/Viện đăng ký lập 1 đội nam và 01 đội nữ. Mỗi đội gồm 07 sinh viên thi đấu thể thức Sân 5. Lưu ý nếu số lượng đăng kí vượt  quá 7 bạn thì sẽ có 1 buổi tiến hành lựa chọn các bạn để tham gia thi đấu!" />
                    <TextComponent text="Thời gian: từ ngày 10/3/2024 - 17/3/2024." />
                    <TextComponent text="Địa điểm: Nhà thi đấu đa năng, Trường Đại học Nha Trang" />
                    <TextComponent
                        text="Cơ cấu giải thưởng:
                           - 02 giải Nhất (02 giải x 1.000.000đ/giải)
                            - 02 giải Nhì (02 giải x 700.000đ/giải)
                            - 04 giải Ba (04 giải x 500.000đ/giải)"
                    />
                </View>
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
