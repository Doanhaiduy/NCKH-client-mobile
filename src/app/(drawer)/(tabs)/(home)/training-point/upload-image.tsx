import { ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { globalStyles } from '@/styles';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { sleep } from '@/utils';
import { LoadingModal } from '@/modals';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

export default function UploadImage() {
    const [images, setImages] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);

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
            setIsLoading(true);
            // handleUploadAvatar(result.assets[0]);
            await sleep(1000);
            setImages([...images, result.assets[0]]);
            setIsLoading(false);
            console.log('upload avatar');
        }
        setIsLoading(false);
    };

    return (
        <ContainerComponent
            title="Tải lên ảnh minh chứng"
            iconLeft="back"
            iconRight={
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert('Lưu', 'Bạn có chắc chắn muốn lưu minh chứng này?', [
                            {
                                text: 'Hủy',
                                style: 'cancel',
                            },
                            {
                                text: 'Lưu',
                                onPress: () => {
                                    router.back();
                                    Alert.alert('Thông báo', 'Lưu thành công');
                                },
                            },
                        ]);
                    }}
                >
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
            {images.length <= 0 ? (
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
            ) : (
                <SectionComponent>
                    <View className="w-full flex-row gap-3 flex-wrap ">
                        {images.map((image: any, index: number) => (
                            <View key={index} className="w-[80px] h-[80px] relative">
                                <Image source={{ uri: image.uri }} className="w-full h-full" resizeMode="cover" />
                                <TouchableOpacity
                                    className="absolute right-1 top-1"
                                    onPress={() => {
                                        const newImages = images.filter((_: any, i: number) => i !== index);
                                        setImages(newImages);
                                    }}
                                >
                                    <Ionicons name="close-circle" size={24} color={colors.white} />
                                </TouchableOpacity>
                            </View>
                        ))}

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
            )}
            <LoadingModal visible={isLoading} message="Đang tải ảnh lên" />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
