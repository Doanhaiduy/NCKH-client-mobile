import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ContainerComponent, SectionComponent, TextComponent } from '@/components';
import { Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';

export default function SettingPage() {
    return (
        <ContainerComponent isScroll title="Cài đặt" iconLeft="menu" search>
            <SectionComponent className="flex-row flex-1 items-center mt-4">
                <View className="border-1 border rounded-full border-primary-400 p-[2px]">
                    <Image
                        source={{
                            uri: 'https://s3-alpha-sig.figma.com/img/ac9e/333b/78f77c3ee3d9cf7d68381921d292808d?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BQ~Na75ONesiM0JCrsxbr3pvhka8Hb0vSSkMPGnrpivp8ey3l55AseGsL4dzbRjZ3FA3kHM3zdL1u1jQY0vYgtkyJUq8J9Civ61UuN0o1iqHrK1m4nv9FEHThm64RF4hWiKet3UCRkzXE5JOo5YiRFVx65gkOnzg5hyLzKMAZDVgCsTCKTOnfBDBsocTFsk5IEyOgEyAinrAmBsPEnkDcrFL7zU2hWYGrqUrB4NEoe6dEM3xbT7wjLo3dHIG88ilbuML7jePx1xmcxv4szaGd0mLyAqVDAfM5Hw5szAHZlJ~KhTwqWfRvLZVvwNAVXtQGuhcVcngEDnaAEO1hASOeg__',
                        }}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 9999,
                            resizeMode: 'cover',
                        }}
                    />
                </View>
                <View className="ml-4 flex-1">
                    <TextComponent text="Nguyễn Trà My" className="text-xl" />
                    <TextComponent text="MSSV: 63123456" className="text-base text-gray-400" />
                </View>
                <Feather name="edit" size={24} color={colors.primary600} />
            </SectionComponent>

            <SectionComponent className="mt-4">
                <TouchableOpacity
                    className="flex-row flex-1 items-center py-6 border-y-[1px] border-y-text-500"
                    onPress={() => router.push('setting/language')}
                >
                    <Ionicons name="earth-outline" size={26} color={colors.primary400} />
                    <TextComponent text="Ngôn ngữ" className="text-base ml-4 flex-1" />
                    <Ionicons name="chevron-forward" size={26} color={colors.text500} />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row flex-1 items-center py-6 border-b-[1px] border-b-text-500"
                    onPress={() => router.push('setting/reset-password')}
                >
                    <Entypo name="lock" size={26} color={colors.primary400} />
                    <TextComponent text="Đổi mật khẩu" className="text-base ml-4 flex-1" />
                    <Ionicons name="chevron-forward" size={26} color={colors.text500} />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row flex-1 items-center py-6 border-b-[1px] border-b-text-500"
                    onPress={() => router.push('setting/helps')}
                >
                    <Feather name="info" size={26} color={colors.primary400} />
                    <TextComponent text="Trợ giúp" className="text-base ml-4 flex-1" />
                    <Ionicons name="chevron-forward" size={26} color={colors.text500} />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row flex-1 items-center py-6 border-b-[1px] border-b-text-500"
                    onPress={() => {
                        Alert.alert('Thông báo', 'Bạn có chắc chắn muốn đăng xuất?', [
                            {
                                text: 'Hủy',
                                style: 'cancel',
                            },
                            {
                                text: 'Đồng ý',
                                onPress: () => router.navigate('/sign-in'),
                            },
                        ]);
                    }}
                >
                    <FontAwesome name="sign-out" size={26} color={colors.primary400} />
                    <TextComponent text="Đăng xuất" className="text-base ml-4 flex-1" />
                </TouchableOpacity>
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
