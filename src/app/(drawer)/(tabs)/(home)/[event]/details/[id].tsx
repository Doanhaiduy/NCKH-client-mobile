import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
    ButtonComponent,
    ContainerComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

export default function Details() {
    const { id, event, eventName } = useLocalSearchParams();

    return (
        <ContainerComponent iconLeft='back' title={eventName?.toString()} search isScroll>
            <Image
                source={{
                    uri: 'https://s3-alpha-sig.figma.com/img/979f/dc7f/c764fcfb235f4dc22a37a7f6d29a79b4?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=h4CrxRvk~baDsZXY~JS0x2XcCmzvTasN3wKrFRzjm2s4XSgo7VxrG716E7j2tC7K3vdAZKIe04eLyz-3PVp7ks4o5iNlSI3ruON0raBOfaaac1zqLfucBLRtZy4jJGeF5EHuRKTuTSbZrw2avthU~5BUOPy4sTaLoYUaUowFvTxS14stXEkAAr6Fuia8bAJ~WLGdSf-atP6OG3Rivkn-MLMItepZMjN6dG8D73e1qXswkR8S1FpXq7B00ULC~pHWgQJj308tLv8rk0ruvQjGSSFkXEi29FZkseOOJwWGWOpgbmq~ORf1pY-czS4keN6tsYcmEXENLmKCZvE4BTEGRg__',
                }}
                resizeMode='cover'
                className='w-full h-[260px]'
            />
            <SectionComponent className='flex-1 py-2'>
                <RowComponent className='justify-between w-full'>
                    <RowComponent>
                        <Ionicons name='calendar' size={14} color={colors['text800']} />
                        <TextComponent text='10/10/2021' className='text-[13px] text-text-800' />
                    </RowComponent>
                    {event === 'Đang diễn ra' && (
                        <ButtonComponent
                            title='Đăng ký'
                            size='small'
                            type='primary'
                            icon={<Ionicons name='add' size={20} color='white' />}
                            iconFlex='left'
                            onPress={() => {}}
                        />
                    )}
                </RowComponent>
                <SpaceComponent height={16} />
                <TextComponent
                    color={colors.primary600}
                    size={20}
                    text='THÔNG BÁO VỀ VIỆC ĐĂNG KÍ THAM GIA GIẢI BÓNG CHUYỀN NAM – NỮ khoa Công nghệ thông tin năm 2024'
                />
                <View className='pt-4 flex-col gap-3'>
                    <TextComponent text='Đối tượng tham gia: sinh viên Khoa Công Nghệ Thông Tin' />
                    <TextComponent text='Thể lệ cuộc thi:  Mỗi đoàn Khoa/Viện đăng ký lập 1 đội nam và 01 đội nữ. Mỗi đội gồm 07 sinh viên thi đấu thể thức Sân 5. Lưu ý nếu số lượng đăng kí vượt  quá 7 bạn thì sẽ có 1 buổi tiến hành lựa chọn các bạn để tham gia thi đấu!' />
                    <TextComponent text='Thời gian: từ ngày 10/3/2024 - 17/3/2024.' />
                    <TextComponent text='Địa điểm: Nhà thi đấu đa năng, Trường Đại học Nha Trang' />
                    <TextComponent
                        text='Cơ cấu giải thưởng:
                           - 02 giải Nhất (02 giải x 1.000.000đ/giải)
                            - 02 giải Nhì (02 giải x 700.000đ/giải)
                            - 04 giải Ba (04 giải x 500.000đ/giải)'
                    />
                </View>
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
