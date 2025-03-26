import { ContainerComponent, PortalizeComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { globalStyles } from '@/styles';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import mime from 'mime';
import { LoadingModal } from '@/modals';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { router, useLocalSearchParams } from 'expo-router';
import { Modalize } from 'react-native-modalize';
import trainingPointAPI from '@/apis/trainingPointApi';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '@/stores/reducers/authReducer';
import { useIsFocused } from '@react-navigation/native';
import ImageComponent from '@/components/ImageComponent';
import { useRefreshing } from '@/hooks/useRefreshing';
import { setTrainingPointRefresh } from '@/stores/reducers/refreshReducer';
import { useTranslation } from 'react-i18next';

export default function UploadImage() {
    const { t } = useTranslation();
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [currentImages, setCurrentImages] = useState<
        {
            uri: string;
            id: string;
        }[]
    >([]);
    const { authData } = useSelector(authSelector);

    const { id } = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const modalizeRef = React.useRef<Modalize>(null);
    const dispatch = useDispatch();

    const isFocused = useIsFocused();

    const pickImage = async (option: 'camera' | 'library') => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert(t('upload_image.permission_denied'));
            return;
        }

        let result: any = null;

        if (option === 'camera') {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: 'images',
                quality: 0.1,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsMultipleSelection: true,
                quality: 0.1,
            });
        }

        if (!result.canceled) {
            const manipulatedImages = await Promise.all(
                result.assets.map(async (asset: any) => {
                    const manipulatedImage = await ImageManipulator.manipulateAsync(
                        asset.uri,
                        [{ resize: { width: 800 } }],
                        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG },
                    );
                    return manipulatedImage;
                }),
            );

            setImages([...images, ...manipulatedImages]);
        }
    };

    const { data, isFetching, refetch } = useQuery({
        queryKey: ['training-points', id],
        queryFn: () => trainingPointAPI.getCriteriaEvidence(id?.toString() ?? ''),
    });

    const { refreshing, handleRefresh } = useRefreshing(refetch);

    useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused]);

    useEffect(() => {
        if (data) {
            const parserImages: ImagePicker.ImagePickerAsset[] = data.data.map((item: ResponseEvidence) => ({
                currentImage: true,
                uri: item.url,
                id: item.public_id,
                fileName: item.url.split('/').pop(),
                type: 'image',
                width: 800,
                height: 600,
            }));
            setImages(parserImages);
        }
    }, [data]);

    const checkNotChange = () => {
        if (images.length !== data?.data.length) return true;
        return images.some((image: any) => !image.currentImage);
    };

    const handleUploadImages = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            images.forEach(async (image: any) => {
                const newImageUri = image.uri;
                const postData = {
                    name: newImageUri.split('/').pop(),
                    uri: newImageUri,
                    type: image.currentImage ? 'image/jpeg' : (await mime.getType(newImageUri)) || '',
                };
                formData.append('evidence', postData as any);
            });
            const res = await trainingPointAPI.updateCriteriaEvidence(id?.toString() ?? '', formData);
            if (res) {
                Alert.alert(t('upload_image.success_title'), t('upload_image.success_message'));
                console.log(res);
                setIsLoading(false);
                dispatch(setTrainingPointRefresh(true));
                router.back();
            }
            setIsLoading(false);
        } catch (error) {
            console.log('error', error);
            Alert.alert(t('upload_image.error_title'), t('upload_image.error_message'));
            setIsLoading(false);
        }
    };

    return (
        <ContainerComponent
            title={t('upload_image.title')}
            handleRefresh={handleRefresh}
            _refreshing={refreshing}
            isScroll
            iconLeft='back'
            iconRight={
                <TouchableOpacity
                    onPress={() => {
                        if (!checkNotChange()) {
                            router.back();
                            return;
                        }
                        if (images.length <= 0) {
                            Alert.alert(
                                t('upload_image.no_image_error_title'),
                                t('upload_image.no_image_error_message'),
                            );
                            return;
                        }
                        Alert.alert(
                            t('upload_image.save_confirmation_title'),
                            t('upload_image.save_confirmation_message'),
                            [
                                {
                                    text: t('upload_image.cancel_button'),
                                    style: 'cancel',
                                },
                                {
                                    text: t('upload_image.save_button'),
                                    onPress: () => {
                                        handleUploadImages();
                                    },
                                },
                            ],
                        );
                    }}
                >
                    <TextComponent text={t('upload_image.save_button')} size={20} color={colors.primary400} />
                </TouchableOpacity>
            }
        >
            <SectionComponent className='items-center'>
                <SpaceComponent height={16} />
                <TextComponent
                    text={t('upload_image.student_id_label').replace('{username}', authData?.username || '')}
                    className='font-interMd'
                    size={20}
                />
                <TextComponent
                    text={t('upload_image.student_name_label').replace('{fullName}', authData?.fullName || '')}
                    className='font-interMd mt-2'
                    size={20}
                    center
                />
                <TextComponent
                    text={t('upload_image.evidence_label')}
                    color={colors.text400}
                    className='mt-2'
                    size={16}
                />
            </SectionComponent>
            {images.length <= 0 ? (
                <SectionComponent>
                    <TouchableOpacity
                        className='w-full h-[128px] border-[1px] border-dotted border-primary-400 items-center justify-center'
                        style={{
                            borderRadius: 10,
                        }}
                        onPress={() => modalizeRef.current?.open()}
                    >
                        <Feather name='image' size={32} color={colors.primary400} />
                        <TextComponent text={t('upload_image.upload_image_button')} size={20} />
                    </TouchableOpacity>
                </SectionComponent>
            ) : (
                <SectionComponent>
                    <View className='w-full flex-row gap-3 flex-wrap'>
                        {images.map((image: any, index: number) => (
                            <View key={index} className='w-[80px] h-[80px] relative'>
                                <ImageComponent url={image.uri} rounded={4} showImageModal />
                                <TouchableOpacity
                                    className='absolute right-0 top-0'
                                    onPress={() => {
                                        const newImages = images.filter((_: any, i: number) => i !== index);
                                        setImages(newImages);
                                    }}
                                >
                                    <Ionicons name='close-circle-sharp' size={24} color={colors.text300} />
                                </TouchableOpacity>
                            </View>
                        ))}

                        <TouchableOpacity
                            className='w-[80px] h-[80px] border-[1px] border-dotted border-primary-400'
                            onPress={() => modalizeRef.current?.open()}
                        >
                            <View className='' style={[globalStyles.centerAbsolute]}>
                                <Ionicons name='add' size={24} color={colors.primary400} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </SectionComponent>
            )}

            <PortalizeComponent
                ref={modalizeRef}
                children={
                    <View className='shadow-xl gap-3 p-3'>
                        <TouchableOpacity
                            className='flex-row items-center'
                            onPress={() => {
                                pickImage('library');
                                modalizeRef.current?.close();
                            }}
                        >
                            <Ionicons name='image' size={22} color='black' />
                            <TextComponent text={t('upload_image.select_from_library')} className='ml-2 font-medium' />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className='flex-row py-2 items-center'
                            onPress={() => {
                                pickImage('camera');
                                modalizeRef.current?.close();
                            }}
                        >
                            <Ionicons name='camera' size={24} color='black' />
                            <TextComponent text={t('upload_image.take_photo')} className='ml-2 font-medium' />
                        </TouchableOpacity>
                    </View>
                }
            />
            {isLoading || isFetching ? (
                <LoadingModal
                    message={isFetching ? t('upload_image.loading_data_message') : t('upload_image.uploading_message')}
                />
            ) : null}
        </ContainerComponent>
    );
}
