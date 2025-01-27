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
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

export default function ScanQRScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const { id, eventCode } = useLocalSearchParams();
    const [currentLocation, setCurrentLocation] = useState<EventLocation>();
    const { authData } = useSelector(authSelector);
    const [encryptedData, setEncryptedData] = useState<string | null>(null);
    const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
    const [isTakePhoto, setIsTakePhoto] = useState(false);
    const [picture, setPicture] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

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
                    console.log('==== eventDetails ====', data);
                })
                .catch((error) => {
                    Alert.alert('Thông báo', 'Không tìm thấy sự kiện', [
                        {
                            text: 'Quay lại',
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
            Alert.alert('Thông báo', 'Ứng dụng cần quyền truy cập vị trí để điểm danh.', [
                {
                    text: 'Mở cài đặt',
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
            console.log(api);
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
        if (eventCode !== dataDecrypt?.eventCode) {
            setError('Mã QR không hợp lệ');
            setScanned(true);
            modalizeRefFailed.current?.open();
            return false;
        }
        if (!checkTimeActive(dataDecrypt?.startAt || 0, dataDecrypt?.endAt || 0)) {
            setError('Thời gian điểm danh không hợp lệ');
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
                setError(`Bạn cần đến gần hơn ${distance - eventDetails?.distanceLimit}(m) để điểm danh.`);
                setScanned(true);
                modalizeRefFailed.current?.open();
                return false;
            }
        }

        return true;
    };

    const handleBarCodeScanned = async ({ type, data }: any) => {
        setScanned(true);
        try {
            await sleep(1000);
            const dataParse = JSON.parse(data);
            const dataDecrypt = decryptData(dataParse.data);

            setEncryptedData(dataParse.data);
            if (!dataDecrypt) {
                setError('Mã QR không hợp lệ');
                setScanned(true);
                modalizeRefFailed.current?.open();
                return;
            }
            if (await handleCheck(dataDecrypt)) {
                setIsTakePhoto(true);
                try {
                    // await reverseLocation(currentLocation?.lat!, currentLocation?.lng!);
                    // const dataLocation = eventDetails?.location;
                    // mutate(dataLocation as EventLocation);
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            setError('Mã QR không hợp lệ');
            setScanned(true);
            modalizeRefFailed.current?.open();
        }
    };

    const handleTakePhoto = async () => {
        try {
            const photo = await cameraRef?.current?.takePictureAsync();
            setPicture(photo?.uri as string);
            modalizeShowPhoto.current?.open();
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    if (!permission) {
        return <View />;
    }
    if (!permission.granted) {
        return (
            <ContainerComponent iconLeft="back" title="Quét mã QR">
                <SectionComponent className="items-center mt-6">
                    <Text className="text-base font-medium">
                        Ứng dụng cần quyền truy cập máy ảnh để quét mã QR. Vui lòng bật quyền truy cập máy ảnh.
                    </Text>
                    <SpaceComponent height={20} />
                    <ButtonComponent
                        onPress={() => {
                            if (!permission.canAskAgain) {
                                Linking.openSettings();
                            }
                            requestPermission();
                        }}
                        title={'Cấp quyền truy cập máy ảnh'}
                        size="large"
                        type="primary"
                    />
                </SectionComponent>
            </ContainerComponent>
        );
    }

    return (
        <View style={{ flex: 1, position: 'relative' }}>
            {isTakePhoto ? (
                <CameraView facing="front" className="flex-1" ref={cameraRef}>
                    <View className="flex-1 items-center justify-center">
                        <TouchableOpacity
                            onPress={() => {
                                setIsTakePhoto(false);
                                setScanned(false);
                            }}
                            style={{ position: 'absolute', top: 60, left: 20 }}
                        >
                            <Ionicons name="chevron-back" size={44} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View>
                        <View
                            className="items-center justify-center w-full mx-auto"
                            style={{ position: 'absolute', bottom: 0 }}
                        >
                            <View className="items-center w-full h-full justify-between mb-[15vh]">
                                <View className="">
                                    <TextComponent
                                        text="Đưa khuôn mặt vào khung và chụp ảnh"
                                        size={16}
                                        className="text-white font-interMd mb-4 text-center"
                                    />
                                    <Image
                                        source={require('@/assets/images/scanner-action.png')}
                                        style={{ width: 350, height: 350, alignSelf: 'center', opacity: 0.8 }}
                                    />
                                </View>
                                <TouchableOpacity onPress={handleTakePhoto}>
                                    <Ionicons name="camera" size={44} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </CameraView>
            ) : (
                <CameraView
                    facing="back"
                    className="flex-1"
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr', 'pdf417'],
                    }}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                >
                    <View className="flex-1 items-center justify-center">
                        <TouchableOpacity
                            onPress={() => router.dismiss()}
                            style={{ position: 'absolute', top: 60, left: 20 }}
                        >
                            <Ionicons name="close" size={44} color="white" />
                        </TouchableOpacity>
                        <TextComponent
                            text="Hướng camera về phía mã QR"
                            size={16}
                            className="text-white  font-interMd mb-4"
                        />
                        <Image
                            source={require('@/assets/images/scanner-action.png')}
                            style={{ width: 350, height: 350, alignSelf: 'center', opacity: 0.8 }}
                        />
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
                    <View className="shadow-xl gap-5 p-3 bg-white">
                        <View
                            className="border-[2px] border-white  items-center"
                            style={{
                                borderRadius: 99,
                            }}
                        >
                            <Ionicons name="close-circle" size={100} color={colors.error} />
                        </View>
                        <View className="justify-center items-center">
                            <TextComponent
                                className="text-center text-xl font-bold"
                                text="Điểm danh không thành công"
                            />
                            <TextComponent
                                className="mt-2 text-center text-sm max-w-[70%] "
                                text="Đã có lỗi xảy ra trong quá trình điểm danh"
                            />
                            <TextComponent
                                className="mt-2 text-center text-sm max-w-[70%] text-error"
                                text={error || ''}
                            />
                        </View>

                        <View className="flex-row justify-center">
                            <SpaceComponent width={6} />
                            <ButtonComponent
                                title="Quét lại"
                                onPress={async () => {
                                    modalizeRefFailed.current?.close();
                                    await sleep(1000);
                                    setScanned(false);
                                }}
                                type="primary"
                                size="large"
                            />
                        </View>
                    </View>
                }
            />
            <PortalizeComponent
                ref={modalizeRefSuccess}
                children={
                    <View className="shadow-xl gap-5 p-3 bg-white">
                        <View
                            className="border-[2px] border-white items-center"
                            style={{
                                borderRadius: 99,
                            }}
                        >
                            <Ionicons name="checkmark-circle" size={100} color={colors.primary400} />
                        </View>
                        <View className="justify-center items-center">
                            <TextComponent className="text-center text-xl font-bold" text="Điểm danh thành công" />
                            <TextComponent
                                className="mt-2 text-center text-sm max-w-[70%] "
                                text="Bạn đã điểm danh thành công sự kiện: "
                            />
                            <TextComponent className="font-bold" text={eventDetails?.name?.toString() || ''} />
                        </View>

                        <View>
                            <ButtonComponent
                                title={'Xác nhận'}
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
                                type="primary"
                                size="large"
                            />
                        </View>
                    </View>
                }
            />
            <PortalizeComponent
                ref={modalizeShowPhoto}
                children={
                    <View className="shadow-xl gap-5 p-3 bg-white">
                        <TextComponent className="text-center text-xl font-bold" text="Ảnh chụp" />
                        {picture && (
                            <Image
                                source={{ uri: picture || '' }}
                                className="w-[90%] h-[50vh] self-center rounded-[12px]"
                            />
                        )}

                        <View>
                            <ButtonComponent
                                title={'Xác nhận'}
                                onPress={async () => {
                                    setIsLoading(true);
                                    setLoadingMessage('Đang xử lý ảnh');
                                    // detect face
                                    await sleep(3000);
                                    // check in
                                    if (true) {
                                        setLoadingMessage('Đang điểm danh');
                                        await reverseLocation(currentLocation?.lat!, currentLocation?.lng!);
                                        const dataLocation = eventDetails?.location;
                                        mutate(dataLocation as EventLocation);
                                        modalizeShowPhoto.current?.close();
                                        setIsLoading(false);
                                    } else {
                                        setError('Ảnh không hợp lệ');
                                        setScanned(true);
                                        setIsLoading(false);
                                        modalizeShowPhoto.current?.close();
                                        modalizeRefFailed.current?.open();
                                        setIsLoading(false);
                                    }
                                }}
                                type="primary"
                                size="large"
                            />

                            <SpaceComponent height={12} />
                            <ButtonComponent
                                title={'Chụp lại'}
                                onPress={() => {
                                    setPicture(null);
                                    modalizeShowPhoto.current?.close();
                                    setIsTakePhoto(true);
                                }}
                                type="outline"
                                size="large"
                            />
                        </View>
                    </View>
                }
            />

            {isPending || isLoading ? <LoadingModal message={isLoading ? loadingMessage : 'Đang xử lý'} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({});
