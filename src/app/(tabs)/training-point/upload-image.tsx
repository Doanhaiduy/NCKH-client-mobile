import { ContainerComponent, PortalizeComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { globalStyles } from '@/styles';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import mime from 'mime';
import { LoadingModal } from '@/modals';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import userAPI from '@/apis/userApi';
import { Modalize } from 'react-native-modalize';
import trainingPointAPI from '@/apis/trainingPointApi';
import { useQuery } from '@tanstack/react-query';

export default function UploadImage() {
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [currentImages, setCurrentImages] = useState<
        {
            uri: string;
            id: string;
        }[]
    >([]);

    const { id } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const modalizeRef = React.useRef<Modalize>(null);

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
                quality: 0.5,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                // allowsEditing: true,
                // aspect: [4, 3],
                quality: 0.5,
            });
        }

        console.log(result);

        if (!result.canceled) {
            setIsLoading(true);
            setImages([...images, ...result.assets]);
            setIsLoading(false);
            console.log('upload avatar');
        }
        setIsLoading(false);
    };

    const { data, isFetching, refetch } = useQuery({
        queryKey: ['training-points', id],
        queryFn: () => trainingPointAPI.getCriteriaEvidence(id?.toString() ?? ''),
    });

    useEffect(() => {
        if (data) {
            const parserImages = data[0].data.map((item: ResponseEvidence) => ({
                uri: item.url,
                id: item.public_id,
            }));
            setCurrentImages(parserImages);
        }
    }, [data]);

    const handleUploadImages = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            images.forEach(async (image: any) => {
                const newImageUri = image.uri;
                const postData = {
                    name: newImageUri.split('/').pop(),
                    uri: newImageUri,
                    type: (await mime.getType(newImageUri)) || '',
                };
                formData.append('evidence', postData as any);
            });
            console.log(formData);

            // const res = await userAPI.HandleUser<
            //     {
            //         public_id: string;
            //         url: string;
            //     }[]
            // >('/upload-multiple', formData, 'post', {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            const res = await trainingPointAPI.updateCriteriaEvidence(id?.toString() ?? '', formData);

            console.log(res);

            if (res) {
                Alert.alert('Thông báo', 'Tải ảnh lên thành công');
                console.log(res);
                setIsLoading(false);
                router.back();
            }
            setIsLoading(false);
        } catch (error) {
            console.log('error ~ ', error);
            Alert.alert('Lỗi', 'Tải ảnh lên thất bại');
            setIsLoading(false);
        }
    };
    return (
        <ContainerComponent
            title="Tải lên ảnh minh chứng"
            handleRefresh={refetch}
            _refreshing={isFetching}
            isScroll
            iconLeft="back"
            iconRight={
                <TouchableOpacity
                    onPress={() => {
                        if (images.length <= 0) {
                            Alert.alert('Lỗi', 'Vui lòng chọn ảnh để tải lên');
                            return;
                        }
                        Alert.alert('Lưu', 'Bạn có chắc chắn muốn lưu minh chứng này?', [
                            {
                                text: 'Hủy',
                                style: 'cancel',
                            },
                            {
                                text: 'Lưu',
                                onPress: () => {
                                    handleUploadImages();
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
                <TextComponent text="Tải lên minh chứng mục 1.2" color={colors.text400} className="mt-2" size={16} />
            </SectionComponent>
            {currentImages.length > 0 && (
                <SectionComponent>
                    <TextComponent text="Ảnh đã tải lên" size={20} />
                    <View className="w-full flex-row gap-3 flex-wrap ">
                        {currentImages.map((image: any, index: number) => (
                            <View key={index} className="w-[80px] h-[80px] relative">
                                <Image source={{ uri: image.uri }} className="w-full h-full" resizeMode="cover" />
                                <TouchableOpacity
                                    className="absolute right-1 top-1"
                                    onPress={() => {
                                        const newImages = currentImages.filter((_: any, i: number) => i !== index);
                                        setCurrentImages(newImages);
                                    }}
                                >
                                    {/* <Ionicons name='close-circle' size={24} color={colors.white} /> */}
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </SectionComponent>
            )}
            {images.length <= 0 ? (
                <SectionComponent>
                    <TouchableOpacity
                        className="w-full h-[128px] border-[1px] border-dotted border-primary-400 rounded-[10px] items-center justify-center"
                        onPress={() => modalizeRef.current?.open()}
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
                            onPress={() => modalizeRef.current?.open()}
                        >
                            <View className="" style={[globalStyles.centerAbsolute]}>
                                <Ionicons name="add" size={24} color={colors.primary400} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </SectionComponent>
            )}

            <PortalizeComponent
                ref={modalizeRef}
                children={
                    <View className=" shadow-xl  gap-3 p-3">
                        <TouchableOpacity
                            className="flex-row  items-center"
                            onPress={() => {
                                pickImage('library');
                                modalizeRef.current?.close();
                            }}
                        >
                            <Ionicons name="image" size={22} color="black" />
                            <TextComponent text="Chọn từ thư viện" className="ml-2 font-medium" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-row py-2 items-center"
                            onPress={() => {
                                pickImage('camera');
                                modalizeRef.current?.close();
                            }}
                        >
                            <Ionicons name="camera" size={24} color="black" />
                            <TextComponent text="Chụp ảnh" className="ml-2 font-medium" />
                        </TouchableOpacity>
                    </View>
                }
            />
            <LoadingModal visible={isLoading} message="Đang tải ảnh lên" />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
