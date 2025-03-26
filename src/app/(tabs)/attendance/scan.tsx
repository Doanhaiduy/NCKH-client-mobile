import eventAPI from '@/apis/eventApi';
import { decryptData, sleep } from '@/utils';
import { checkTimeActive } from '@/utils/dateTime';
import {
    ButtonComponent,
    ContainerComponent,
    PortalizeComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@components/index';
import { useMutation } from '@tanstack/react-query';
import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '@/stores/reducers/authReducer';
import axios from 'axios';
import { GeoLocation } from '@/types/geoLocation';
import { Ionicons } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import { colors } from '@/constants/colors';
import { LoadingModal } from '@/modals';
import { setEventNeedsRefresh } from '@/stores/reducers/refreshReducer';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Buffer } from 'buffer';
import jsQR from 'jsqr';
import jpeg from 'jpeg-js';
import handleDetectFace from '@/services/detectApi';
import { useTranslation } from 'react-i18next';
const PNG = require('pngjs/browser').PNG;

export default function ScanQRScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const { id, eventCode } = useLocalSearchParams();
    const [currentLocation, setCurrentLocation] = useState<EventLocation>();
    const { authData } = useSelector(authSelector);
    const [encryptedData, setEncryptedData] = useState<string | null>(null);
    const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
    const [isTakePhoto, setIsTakePhoto] = useState(false);
    const [picture, setPicture] = useState<CameraCapturedPicture | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const { t } = useTranslation();

    const modalizeRefFailed = useRef<Modalize>(null);
    const modalizeRefSuccess = useRef<Modalize>(null);
    const modalizeShowPhoto = useRef<Modalize>(null);
    const cameraRef = useRef<CameraView>(null);

    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            eventAPI
                .getDetailEvents(id.toString())
                .then((data) => {
                    setEventDetails(data);
                })
                .catch((error) => {
                    Alert.alert(t('scan_qr.no_event'), t('scan_qr.no_event'), [
                        {
                            text: t('scan_qr.back'),
                            onPress: () => {
                                router.dismiss();
                            },
                        },
                    ]);
                });
        }
    }, [id, eventCode]);

    const { mutate, isPending } = useMutation({
        mutationFn: (dataLocation: EventLocation) =>
            eventAPI.checkInEvent(
                {
                    checkInAt: new Date().toISOString(),
                    location: currentLocation!,
                    userId: authData?._id!,
                    distance: getDistance(
                        { latitude: currentLocation?.lat!, longitude: currentLocation?.lng! },
                        {
                            latitude: dataLocation?.lat,
                            longitude: dataLocation?.lng,
                        },
                    ),
                    encryptedData: encryptedData || '',
                },
                id?.toString()!,
            ),
        onSuccess: (data) => {
            modalizeRefSuccess.current?.open();
            dispatch(setEventNeedsRefresh(true));
            setIsLoading(false);
        },
        onError: (error: string) => {
            setError(error);
            setScanned(true);
            setIsTakePhoto(false);
            modalizeRefFailed.current?.open();
            setIsLoading(false);
        },
    });

    const getCurrentLocation: any = async () => {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.canAskAgain || permission.status === 'denied') {
            Alert.alert(t('scan_qr.location_permission_prompt'), t('scan_qr.location_permission_prompt'), [
                {
                    text: t('scan_qr.open_settings'),
                    onPress: () => {
                        Linking.openSettings();
                        router.dismiss();
                    },
                },
            ]);
            return;
        }
        if (permission.status === 'granted') {
            const location = await Location.getLastKnownPositionAsync({});
            if (location) {
                setCurrentLocation({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                    name: currentLocation?.name || 'Not found name',
                });
            } else {
                const location = await Location.getCurrentPositionAsync({});
                setCurrentLocation({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                    name: currentLocation?.name || 'Not found name',
                });
            }
        }
    };

    useEffect(() => {
        if (!currentLocation) {
            getCurrentLocation();
        }
    }, []);

    const reverseLocation = async (lat: number, long: number) => {
        try {
            const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi-VN&apiKey=${process
                .env.EXPO_PUBLIC_HERE_LOCATION_API_KEY!}`;
            const res = await axios<{ items: GeoLocation[] }>(api);
            if (res && res.status === 200) {
                setCurrentLocation({
                    ...currentLocation!,
                    name: res.data.items[0].address.label,
                });
            }
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const handleCheck = async (dataDecrypt: EncryptedEventDetails | null) => {
        if (!currentLocation) {
            getCurrentLocation();
            return false;
        }

        if (eventCode ? eventCode !== dataDecrypt?.eventCode : eventDetails?.eventCode !== dataDecrypt?.eventCode) {
            setError(t('scan_qr.invalid_qr'));
            setScanned(true);
            modalizeRefFailed.current?.open();
            return false;
        }
        if (!checkTimeActive(dataDecrypt?.startAt || 0, dataDecrypt?.endAt || 0)) {
            setError(t('scan_qr.invalid_time'));
            setScanned(true);
            modalizeRefFailed.current?.open();
            return false;
        }
        if (eventDetails?.location) {
            const dataLocation = eventDetails.location;
            const distance = getDistance(
                { latitude: currentLocation.lat, longitude: currentLocation.lng },
                { latitude: dataLocation.lat, longitude: dataLocation.lng },
            );
            if (distance > eventDetails?.distanceLimit && eventDetails?.distanceLimit !== 0) {
                setError(
                    t('scan_qr.distance_error').replace(
                        '{distance}',
                        (distance - eventDetails?.distanceLimit).toString(),
                    ),
                );
                setScanned(true);
                modalizeRefFailed.current?.open();
                return false;
            }
        }

        return true;
    };

    const handlePickImageAndScanQR = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert(t('scan_qr.gallery_permission_prompt'), t('scan_qr.gallery_permission_prompt'), [
                {
                    text: t('scan_qr.open_settings'),
                    onPress: () => {
                        Linking.openSettings();
                        router.dismiss();
                    },
                },
            ]);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            quality: 0.1,
        });
        if (!result.canceled && result.assets.length > 0) {
            setIsLoading(true);
            setScanned(false);
            setLoadingMessage(t('scan_qr.reading_qr'));
            try {
                const manipulatedImage = await ImageManipulator.manipulateAsync(
                    result.assets[0].uri,
                    [{ resize: { width: 800 } }],
                    {
                        compress: 0.1,
                        format:
                            result.assets[0].mimeType === 'image/jpeg'
                                ? ImageManipulator.SaveFormat.JPEG
                                : ImageManipulator.SaveFormat.PNG,
                        base64: true,
                    },
                );

                const base64Buffer = Buffer.from(manipulatedImage.base64!, 'base64');
                const image = result.assets[0];
                let pixelData;
                let imageBuffer;
                if (image.mimeType === 'image/jpeg' || image.uri.endsWith('.jpg')) {
                    pixelData = jpeg.decode(base64Buffer, { useTArray: true });
                    imageBuffer = pixelData.data;
                } else if (image.mimeType === 'image/png' || image.uri.endsWith('.png')) {
                    pixelData = PNG.sync.read(base64Buffer);
                    imageBuffer = pixelData.data;
                } else {
                    setIsLoading(false);
                    setError(t('scan_qr.no_qr_found'));
                    setScanned(true);
                    modalizeRefFailed.current?.open();
                    return;
                }

                if (!pixelData || !pixelData.width || !pixelData.height) {
                    setIsLoading(false);
                    setError(t('scan_qr.no_qr_found'));
                    setScanned(true);
                    modalizeRefFailed.current?.open();
                    return;
                }
                const data = Uint8ClampedArray.from(imageBuffer);

                try {
                    const code = jsQR(data, pixelData.width, pixelData.height);
                    if (code) {
                        setIsLoading(false);
                        handleBarCodeScanned({ type: 'qr', data: code.data });
                    } else {
                        setIsLoading(false);
                        setError(t('scan_qr.no_qr_found'));
                        setScanned(true);
                        modalizeRefFailed.current?.open();
                    }
                } catch (err) {
                    setIsLoading(false);
                    setError(t('scan_qr.no_qr_found'));
                    setScanned(true);
                    modalizeRefFailed.current?.open();
                }
            } catch (error) {
                setIsLoading(false);
                setError(t('scan_qr.no_qr_found'));
                setScanned(true);
                modalizeRefFailed.current?.open();
            }
        }
        setIsLoading(false);
        setScanned(true);
    };

    const handleBarCodeScanned = async ({ type, data }: any) => {
        setScanned(true);
        try {
            setLoadingMessage(t('scan_qr.processing_qr'));
            await sleep(1000);
            const dataParse = JSON.parse(data);
            const dataDecrypt = decryptData(dataParse.data);
            setEncryptedData(dataParse.data);
            if (!dataDecrypt) {
                setError(t('scan_qr.invalid_qr'));
                setScanned(true);
                modalizeRefFailed.current?.open();
                return;
            }
            if (await handleCheck(dataDecrypt)) {
                setIsTakePhoto(true);
            }
        } catch (error) {
            setError(t('scan_qr.invalid_qr'));
            setScanned(true);
            modalizeRefFailed.current?.open();
        }
    };

    const handleTakePhoto = async () => {
        try {
            const photo = await cameraRef?.current?.takePictureAsync();
            setPicture(photo || null);
            modalizeShowPhoto.current?.open();
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const handleSubmitCheckIn = async () => {
        try {
            setIsLoading(true);
            setLoadingMessage(t('scan_qr.processing_image'));
            const formData = new FormData();
            if (picture) {
                /* @ts-ignore */
                formData.append('image', {
                    uri: picture.uri,
                    type: 'image/jpeg',
                    name: picture.uri.split('/').pop(),
                });
            }

            formData.append('username', authData?.username || '');
            const dataDetect = await handleDetectFace(formData);

            // if (dataDetect.result) {
            if (true) {
                setLoadingMessage(t('scan_qr.checking_in'));
                await reverseLocation(currentLocation?.lat!, currentLocation?.lng!);
                const dataLocation = eventDetails?.location;
                mutate(dataLocation as EventLocation);
                modalizeShowPhoto.current?.close();
                setIsLoading(false);
            } else {
                setError(t('scan_qr.invalid_image'));
                setScanned(true);
                setIsLoading(false);
                modalizeShowPhoto.current?.close();
                modalizeRefFailed.current?.open();
            }
        } catch (error) {
            setError('Đã xảy ra lỗi trong quá trình điểm danh: ' + error);
            setScanned(true);
            modalizeShowPhoto.current?.close();
            modalizeRefFailed.current?.open();
            setIsLoading(false);
        }
    };

    if (!permission) {
        return <View />;
    }
    if (!permission.granted) {
        return (
            <ContainerComponent iconLeft='back' title={t('scan_qr.title')}>
                <SectionComponent className='items-center mt-6'>
                    <Text className='text-base font-medium'>{t('scan_qr.camera_permission_prompt')}</Text>
                    <SpaceComponent height={20} />
                    <ButtonComponent
                        onPress={() => {
                            if (!permission.canAskAgain) {
                                Linking.openSettings();
                            }
                            requestPermission();
                        }}
                        title={t('scan_qr.grant_camera_access')}
                        size='large'
                        type='primary'
                    />
                </SectionComponent>
            </ContainerComponent>
        );
    }

    return (
        <View style={{ flex: 1, position: 'relative' }}>
            {isTakePhoto ? (
                <CameraView facing='front' className='flex-1' ref={cameraRef}>
                    <View className='flex-1 items-center justify-center'>
                        <TouchableOpacity
                            onPress={() => {
                                setIsTakePhoto(false);
                                setScanned(false);
                            }}
                            style={{ position: 'absolute', top: 60, left: 20 }}
                        >
                            <Ionicons name='chevron-back' size={44} color='white' />
                        </TouchableOpacity>
                    </View>

                    <View>
                        <View
                            className='items-center justify-center w-full mx-auto'
                            style={{ position: 'absolute', bottom: 0 }}
                        >
                            <View className='items-center w-full h-full justify-between mb-[15vh]'>
                                <View className=''>
                                    <TextComponent
                                        text={t('scan_qr.take_photo_instruction')}
                                        size={16}
                                        className='text-white font-interMd mb-4 text-center'
                                    />
                                    <Image
                                        source={require('@/assets/images/scanner-action.png')}
                                        style={{ width: 350, height: 350, alignSelf: 'center', opacity: 0.8 }}
                                    />
                                </View>
                                <TouchableOpacity onPress={handleTakePhoto}>
                                    <Ionicons name='camera' size={44} color='white' />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </CameraView>
            ) : (
                <CameraView
                    facing='back'
                    className='flex-1'
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr', 'pdf417'],
                    }}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                >
                    <View className='flex-1 items-center justify-center'>
                        <TouchableOpacity
                            onPress={() => router.dismiss()}
                            style={{ position: 'absolute', top: 60, right: 20 }}
                        >
                            <Ionicons name='close' size={44} color='white' />
                        </TouchableOpacity>
                        <TextComponent
                            text={t('scan_qr.scan_qr_instruction')}
                            size={16}
                            className='text-white font-interMd mb-4'
                        />
                        <Image
                            source={require('@/assets/images/scanner-action.png')}
                            style={{ width: 350, height: 350, alignSelf: 'center', opacity: 0.8 }}
                        />
                        <TouchableOpacity
                            onPress={handlePickImageAndScanQR}
                            style={{ position: 'absolute', bottom: 60, left: 20 }}
                        >
                            <Ionicons name='images' size={44} color='white' />
                        </TouchableOpacity>
                    </View>
                </CameraView>
            )}
            <PortalizeComponent
                onClose={async () => {
                    await sleep(1000);
                    setScanned(false);
                }}
                ref={modalizeRefFailed}
                children={
                    <View className='shadow-xl gap-5 p-3 bg-white'>
                        <View
                            className='border-[2px] border-white items-center'
                            style={{
                                borderRadius: 99,
                            }}
                        >
                            <Ionicons name='close-circle' size={100} color={colors.error} />
                        </View>
                        <View className='justify-center items-center'>
                            <TextComponent
                                className='text-center text-xl font-bold'
                                text={t('scan_qr.check_in_failed')}
                            />
                            <TextComponent
                                className='mt-2 text-center text-sm max-w-[70%]'
                                text={t('scan_qr.check_in_failed_message')}
                            />
                            <TextComponent
                                className='mt-2 text-center text-sm max-w-[70%] text-error'
                                text={error || ''}
                            />
                        </View>

                        <View className='flex-row justify-center'>
                            <SpaceComponent width={6} />
                            <ButtonComponent
                                title={t('scan_qr.scan_again')}
                                onPress={async () => {
                                    modalizeRefFailed.current?.close();
                                    await sleep(1000);
                                    setScanned(false);
                                }}
                                type='primary'
                                size='large'
                            />
                        </View>
                    </View>
                }
            />
            <PortalizeComponent
                ref={modalizeRefSuccess}
                children={
                    <View className='shadow-xl gap-5 p-3 bg-white'>
                        <View
                            className='border-[2px] border-white items-center'
                            style={{
                                borderRadius: 99,
                            }}
                        >
                            <Ionicons name='checkmark-circle' size={100} color={colors.primary400} />
                        </View>
                        <View className='justify-center items-center'>
                            <TextComponent
                                className='text-center text-xl font-bold'
                                text={t('scan_qr.check_in_success')}
                            />
                            <TextComponent
                                className='mt-2 text-center text-sm max-w-[70%]'
                                text={t('scan_qr.check_in_success_message')}
                            />
                            <TextComponent className='font-bold' text={eventDetails?.name?.toString() || ''} />
                        </View>

                        <View>
                            <ButtonComponent
                                title={t('scan_qr.confirm')}
                                onPress={async () => {
                                    router.dismiss();
                                    setIsLoading(false);
                                    router.replace({
                                        pathname: '/attendance/list',
                                        params: {
                                            back: 'to_scan',
                                        },
                                    });
                                }}
                                type='primary'
                                size='large'
                            />
                        </View>
                    </View>
                }
            />
            <PortalizeComponent
                ref={modalizeShowPhoto}
                children={
                    <View className='shadow-xl gap-5 p-3 bg-white'>
                        <TextComponent className='text-center text-xl font-bold' text={t('scan_qr.photo_title')} />
                        {picture && (
                            <Image
                                source={{ uri: picture.uri || '' }}
                                className='w-[90%] h-[50vh] self-center rounded-[12px]'
                            />
                        )}

                        <View>
                            <ButtonComponent
                                title={t('scan_qr.confirm')}
                                onPress={handleSubmitCheckIn}
                                type='primary'
                                size='large'
                            />

                            <SpaceComponent height={12} />
                            <ButtonComponent
                                title={t('scan_qr.retake')}
                                onPress={() => {
                                    setPicture(null);
                                    modalizeShowPhoto.current?.close();
                                    setIsTakePhoto(true);
                                }}
                                type='outline'
                                size='large'
                            />
                        </View>
                    </View>
                }
            />

            {isPending || isLoading ? (
                <LoadingModal message={isLoading ? loadingMessage : t('scan_qr.processing_qr')} />
            ) : null}
        </View>
    );
}
