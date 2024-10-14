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
import { useMutation, useQuery } from '@tanstack/react-query';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { useSelector } from 'react-redux';
import { authSelector } from '@/stores/reducers/authReducer';
import axios from 'axios';
import { GeoLocation } from '@/types/geoLocation';
import { Ionicons } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import { colors } from '@/constants/colors';
import { LoadingModal } from '@/modals';
const DataTest = require('./mock.json');

export default function ScanQRScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const { id, eventCode } = useLocalSearchParams();
    const [location, setLocation] = useState<EventLocation>();
    const { authData } = useSelector(authSelector);

    const modalizeRefFailed = useRef<Modalize>(null);
    const modalizeRefSuccess = useRef<Modalize>(null);

    const [error, setError] = useState<string | null>(null);

    const { mutate, isPending } = useMutation({
        mutationFn: (dataLocation: EventLocation) =>
            eventAPI.checkInEvent(
                {
                    checkInAt: new Date().toISOString(),
                    location: location!,
                    userId: authData?.id!,
                    distance: getDistance(
                        { latitude: location?.lat!, longitude: location?.lng! },
                        {
                            latitude: dataLocation?.lat,
                            longitude: dataLocation?.lng,
                        },
                    ),
                },
                id?.toString()!,
            ),
        onSuccess: (data) => {
            modalizeRefSuccess.current?.open();
        },
        onError: (error: string) => {
            setError(error);
            setScanned(true);
            modalizeRefFailed.current?.open();
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
                setLocation({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                    name: 'Not found name',
                });
            } else {
                const location = await Location.getCurrentPositionAsync({});
                setLocation({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                    name: 'Not found name',
                });
            }
        }
    };

    useEffect(() => {
        if (!location) {
            getCurrentLocation();
        }
    }, []);

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

    const reverseLocation = async (lat: number, long: number) => {
        try {
            const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi-VN&apiKey=${process
                .env.EXPO_PUBLIC_HERE_LOCATION_API_KEY!}`;
            console.log(api);
            const res = await axios<{ items: GeoLocation[] }>(api);
            if (res && res.status === 200) {
                setLocation({
                    ...location!,
                    name: res.data.items[0].address.label,
                });
            }
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const handleCheck = async (dataDecrypt: EncryptedEventDetails | null) => {
        if (!location) {
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
        if (dataDecrypt?.location) {
            const dataLocation = dataDecrypt?.location;
            const distance = getDistance(
                { latitude: location.lat, longitude: location.lng },
                { latitude: dataLocation.lat, longitude: dataLocation.lng },
            );
            if (distance > dataDecrypt?.distanceLimit && dataDecrypt?.distanceLimit !== 0) {
                setError(`Bạn cần đến gần hơn ${distance - dataDecrypt?.distanceLimit}(m) để điểm danh.`);
                setScanned(true);
                modalizeRefFailed.current?.open();
                return false;
            }
        }

        return true;
    };

    const handleBarCodeScanned = async ({ type, data }: any) => {
        setScanned(true);
        // console.log('==== data ====', data.dât);
        // console.log('==== dataTest =====', DataTest);
        try {
            await sleep(1000);
            const dataParse = JSON.parse(data);
            console.log('==== data ====', dataParse.data);
            const dataDecrypt = decryptData(dataParse.data);
            console.log('==== dataDecrypt ====', dataDecrypt);
            if (!dataDecrypt) {
                setError('Mã QR không hợp lệ');
                setScanned(true);
                modalizeRefFailed.current?.open();
                return;
            }
            if (await handleCheck(dataDecrypt)) {
                try {
                    await reverseLocation(location?.lat!, location?.lng!);
                    const dataLocation = dataDecrypt?.location;
                    mutate(dataLocation);
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            setError('Mã QR không hợp lệ 3');
            setScanned(true);
            modalizeRefFailed.current?.open();
        }
    };
    const handleTest = async () => {
        const dataParse = JSON.parse(DataTest);
        console.log('==== data ====', dataParse);
        const dataDecrypt = decryptData(dataParse);
        console.log('==== dataDecrypt ====', dataDecrypt);
    };

    return (
        <View style={{ flex: 1, position: 'relative' }}>
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
                        // onPress={handleTest}
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
            <PortalizeComponent
                onClose={async () => {
                    await sleep(1000);
                    setScanned(false);
                }}
                ref={modalizeRefFailed}
                children={
                    <View className="shadow-xl gap-5 p-3 bg-white">
                        <View className="border-[2px] border-white rounded-full items-center">
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
                        <View className="border-[2px] border-white rounded-full items-center">
                            <Ionicons name="checkmark-circle" size={100} color={colors.success} />
                        </View>
                        <View className="justify-center items-center">
                            <TextComponent className="text-center text-xl font-bold" text="Điểm danh thành công" />
                            <TextComponent
                                className="mt-2 text-center text-sm max-w-[70%] "
                                text="Bạn đã điểm danh thành công sự kiện có mã: "
                            />
                            <TextComponent className="font-bold" text={eventCode?.toString() || ''} />
                        </View>

                        <View>
                            <ButtonComponent
                                title={'Xác nhận'}
                                onPress={async () => {
                                    router.dismiss();
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

            <LoadingModal visible={isPending} />
        </View>
    );
}

const styles = StyleSheet.create({});
