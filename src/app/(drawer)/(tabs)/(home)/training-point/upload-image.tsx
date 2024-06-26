import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { Feather, Ionicons } from '@expo/vector-icons';
import { globalStyles } from '@/styles';

import * as ImagePicker from 'expo-image-picker';

export default function UploadImage() {
    const pickImage = async (option: 'camera' | 'library') => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        let result: any = null;

        if (option === 'camera') {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                // allowsEditing: true,
                // aspect: [4, 3],
                quality: 1,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                // aspect: [1, 1],
                quality: 1,
            });
        }

        console.log(result);

        if (!result.canceled) {
            // handleUploadAvatar(result.assets[0]);
            console.log('upload avatar');
        }
    };

    return (
        <ContainerComponent
            title="Tải lên ảnh minh chứng"
            iconLeft="back"
            iconRight={
                <TouchableOpacity>
                    <TextComponent text="Lưu" size={20} color={colors.primary400} />
                </TouchableOpacity>
            }
        >
            <SectionComponent className="items-center">
                <SpaceComponent height={16} />
                <TextComponent text="Mã sinh viên: 63123456" className="font-interMd" size={20} />
                <TextComponent text="Tên sinh viên: Nguyễn Trà My" className="font-interMd mt-2" size={20} />
                <TextComponent text="Tải lên minh chứng mục 1.2" color={colors.text600} className="mt-2" size={16} />
            </SectionComponent>
            <SectionComponent>
                <TouchableOpacity
                    className="w-full h-[128px] border-[1px] border-dotted border-primary-400 rounded-[10px] items-center justify-center"
                    onPress={() =>
                        Alert.alert('Tải ảnh lên', 'Chọn ảnh từ', [
                            {
                                text: 'Thư viện ảnh',
                                onPress: () => pickImage('library'),
                            },
                            {
                                text: 'Máy ảnh',
                                onPress: () => pickImage('camera'),
                            },
                            {
                                text: 'Hủy',
                                style: 'cancel',
                            },
                        ])
                    }
                >
                    <Feather name="image" size={32} color={colors.primary400} />
                    <TextComponent text="Tải ảnh lên" size={20} />
                </TouchableOpacity>
            </SectionComponent>
            <SectionComponent>
                <View className="w-full flex-row gap-3 flex-wrap ">
                    <View className="w-[80px] h-[80px]">
                        <Image
                            source={{
                                uri: 'https://s3-alpha-sig.figma.com/img/acd6/7df2/cd3fef70f6d2ac294460dc291dc6bf43?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ps7F~U8PagckFk9NMmhm~gV~gVTsvuufKH0Utoh3IG2hqtDfYEIWx6OzJ3TI0h6iKvkYcsqtAOxbeBkA89Nc8EeERXPk3Jj~mm6hBrRf-EK43gfJvS3qoFCacJAGBhYmeRSX8cfKYI8o~x0lNbSgb4HpoTnT5ju1Jwwz4gl~YGMeQjZoqO29qzNMEA6-7jKi8ZbWukAIhmEq1Uv10Dh-48CgakGDL14-wFa5dv1dSBKaPALF2x8baO96nl-6ldvgcqyPlBUnXeSjVQ2VeUWoY0VTcDR2yTsm71iP3xYAylYRQggIml0R6IJE35tp46WHLlkF5jXIWxo9SM73EKaX5Q__',
                            }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        <TouchableOpacity className="absolute right-1 top-1">
                            <Ionicons name="close-circle" size={24} color={colors.text500} />
                        </TouchableOpacity>
                    </View>
                    <View className="w-[80px] h-[80px]">
                        <Image
                            source={{
                                uri: 'https://s3-alpha-sig.figma.com/img/acd6/7df2/cd3fef70f6d2ac294460dc291dc6bf43?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ps7F~U8PagckFk9NMmhm~gV~gVTsvuufKH0Utoh3IG2hqtDfYEIWx6OzJ3TI0h6iKvkYcsqtAOxbeBkA89Nc8EeERXPk3Jj~mm6hBrRf-EK43gfJvS3qoFCacJAGBhYmeRSX8cfKYI8o~x0lNbSgb4HpoTnT5ju1Jwwz4gl~YGMeQjZoqO29qzNMEA6-7jKi8ZbWukAIhmEq1Uv10Dh-48CgakGDL14-wFa5dv1dSBKaPALF2x8baO96nl-6ldvgcqyPlBUnXeSjVQ2VeUWoY0VTcDR2yTsm71iP3xYAylYRQggIml0R6IJE35tp46WHLlkF5jXIWxo9SM73EKaX5Q__',
                            }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        <TouchableOpacity className="absolute right-1 top-1">
                            <Ionicons name="close-circle" size={24} color={colors.text500} />
                        </TouchableOpacity>
                    </View>
                    <View className="w-[80px] h-[80px]">
                        <Image
                            source={{
                                uri: 'https://s3-alpha-sig.figma.com/img/acd6/7df2/cd3fef70f6d2ac294460dc291dc6bf43?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ps7F~U8PagckFk9NMmhm~gV~gVTsvuufKH0Utoh3IG2hqtDfYEIWx6OzJ3TI0h6iKvkYcsqtAOxbeBkA89Nc8EeERXPk3Jj~mm6hBrRf-EK43gfJvS3qoFCacJAGBhYmeRSX8cfKYI8o~x0lNbSgb4HpoTnT5ju1Jwwz4gl~YGMeQjZoqO29qzNMEA6-7jKi8ZbWukAIhmEq1Uv10Dh-48CgakGDL14-wFa5dv1dSBKaPALF2x8baO96nl-6ldvgcqyPlBUnXeSjVQ2VeUWoY0VTcDR2yTsm71iP3xYAylYRQggIml0R6IJE35tp46WHLlkF5jXIWxo9SM73EKaX5Q__',
                            }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        <TouchableOpacity className="absolute right-1 top-1">
                            <Ionicons name="close-circle" size={24} color={colors.text500} />
                        </TouchableOpacity>
                    </View>
                    <View className="w-[80px] h-[80px]">
                        <Image
                            source={{
                                uri: 'https://s3-alpha-sig.figma.com/img/acd6/7df2/cd3fef70f6d2ac294460dc291dc6bf43?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ps7F~U8PagckFk9NMmhm~gV~gVTsvuufKH0Utoh3IG2hqtDfYEIWx6OzJ3TI0h6iKvkYcsqtAOxbeBkA89Nc8EeERXPk3Jj~mm6hBrRf-EK43gfJvS3qoFCacJAGBhYmeRSX8cfKYI8o~x0lNbSgb4HpoTnT5ju1Jwwz4gl~YGMeQjZoqO29qzNMEA6-7jKi8ZbWukAIhmEq1Uv10Dh-48CgakGDL14-wFa5dv1dSBKaPALF2x8baO96nl-6ldvgcqyPlBUnXeSjVQ2VeUWoY0VTcDR2yTsm71iP3xYAylYRQggIml0R6IJE35tp46WHLlkF5jXIWxo9SM73EKaX5Q__',
                            }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        <TouchableOpacity className="absolute right-1 top-1">
                            <Ionicons name="close-circle" size={24} color={colors.text500} />
                        </TouchableOpacity>
                    </View>
                    <View className="w-[80px] h-[80px]">
                        <Image
                            source={{
                                uri: 'https://s3-alpha-sig.figma.com/img/acd6/7df2/cd3fef70f6d2ac294460dc291dc6bf43?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ps7F~U8PagckFk9NMmhm~gV~gVTsvuufKH0Utoh3IG2hqtDfYEIWx6OzJ3TI0h6iKvkYcsqtAOxbeBkA89Nc8EeERXPk3Jj~mm6hBrRf-EK43gfJvS3qoFCacJAGBhYmeRSX8cfKYI8o~x0lNbSgb4HpoTnT5ju1Jwwz4gl~YGMeQjZoqO29qzNMEA6-7jKi8ZbWukAIhmEq1Uv10Dh-48CgakGDL14-wFa5dv1dSBKaPALF2x8baO96nl-6ldvgcqyPlBUnXeSjVQ2VeUWoY0VTcDR2yTsm71iP3xYAylYRQggIml0R6IJE35tp46WHLlkF5jXIWxo9SM73EKaX5Q__',
                            }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        <TouchableOpacity className="absolute right-1 top-1">
                            <Ionicons name="close-circle" size={24} color={colors.text500} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        className="w-[80px] h-[80px] border-[1px] border-dotted border-primary-400"
                        onPress={() =>
                            Alert.alert('Tải ảnh lên', 'Chọn ảnh từ', [
                                {
                                    text: 'Thư viện ảnh',
                                    onPress: () => pickImage('library'),
                                },
                                {
                                    text: 'Máy ảnh',
                                    onPress: () => pickImage('camera'),
                                },
                                {
                                    text: 'Hủy',
                                    style: 'cancel',
                                },
                            ])
                        }
                    >
                        <View className="" style={[globalStyles.centerAbsolute]}>
                            <Ionicons name="add" size={24} color={colors.primary400} />
                        </View>
                    </TouchableOpacity>
                </View>
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
