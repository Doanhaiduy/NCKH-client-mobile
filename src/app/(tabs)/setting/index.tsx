import { ContainerComponent, SectionComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { authSelector, logout } from '@/stores/reducers/authReducer';
import { Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function SettingPage() {
    const { userInfo } = useSelector(authSelector);

    const dispatch = useDispatch();

    return (
        <ContainerComponent isScroll title="Cài đặt" iconLeft="logo" search>
            <SectionComponent className="flex-row flex-1 items-center mt-4">
                <View className="border-1 border rounded-full border-primary-400 p-[2px]">
                    <Image
                        source={{
                            uri: userInfo?.avatar,
                            headers: { Accept: 'image/*' },
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
                    <TextComponent text={userInfo?.fullName || ''} className="text-xl" />
                    <TextComponent text={`MSSV: ${userInfo?.username}`} className="text-base text-gray-400" />
                </View>
                <Feather name="edit" size={24} color={colors.primary300} />
            </SectionComponent>

            <SectionComponent className="mt-4">
                <TouchableOpacity
                    className="flex-row flex-1 w-full items-center py-6 border-y-[1px] border-y-text-200"
                    onPress={() => router.push('setting/language')}
                >
                    <Ionicons name="earth-outline" size={26} color={colors.primary400} />
                    <TextComponent text="Ngôn ngữ" className="text-base ml-4 flex-1" />
                    <Ionicons name="chevron-forward" size={26} color={colors.text500} />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row flex-1 w-full items-center py-6 border-b-[1px] border-b-text-200"
                    onPress={() => router.push('setting/change-password')}
                >
                    <Entypo name="lock" size={26} color={colors.primary400} />
                    <TextComponent text="Đổi mật khẩu" className="text-base ml-4 flex-1" />
                    <Ionicons name="chevron-forward" size={26} color={colors.text500} />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row flex-1 w-full items-center py-6 border-b-[1px] border-b-text-200"
                    onPress={() => router.push('setting/helps')}
                >
                    <Feather name="info" size={26} color={colors.primary400} />
                    <TextComponent text="Trợ giúp" className="text-base ml-4 flex-1" />
                    <Ionicons name="chevron-forward" size={26} color={colors.text500} />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row flex-1 w-full items-center py-6 border-b-[1px] border-b-text-200"
                    onPress={() => {
                        Alert.alert('Thông báo', 'Bạn có chắc chắn muốn đăng xuất?', [
                            {
                                text: 'Hủy',
                                style: 'cancel',
                            },
                            {
                                text: 'Đồng ý',
                                onPress: () => {
                                    dispatch(logout());
                                    router.navigate('/sign-in');
                                },
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
