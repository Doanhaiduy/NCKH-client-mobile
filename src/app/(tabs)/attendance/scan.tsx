import eventAPI from '@/apis/eventApi';
import { decryptData, sleep } from '@/utils';
import { checkTimeActive } from '@/utils/dateTime';
import { ButtonComponent, ContainerComponent, SectionComponent } from '@components/index';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Linking, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { useSelector } from 'react-redux';
import { authSelector } from '@/stores/reducers/authReducer';
import axios from 'axios';
import { GeoLocation } from '@/types/geoLocation';

export default function ScanQRScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const { id, eventCode } = useLocalSearchParams();
    const [location, setLocation] = useState<EventLocation>();
    const { authData } = useSelector(authSelector);

    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            eventAPI.checkInEvent(
                {
                    checkInAt: new Date().toISOString(),
                    location: location!,
                    userId: authData?.id!,
                },
                id?.toString()!,
            ),
        onSuccess: (data) => {
            Alert.alert('Thông báo', 'Điểm danh thành công', [
                {
                    text: 'OK',
                    onPress: () => {
                        setScanned(false);
                        router.dismiss();
                        router.replace({
                            pathname: '/attendance/list',
                            params: {
                                id: data.id,
                            },
                        });
                    },
                },
            ]);
        },
        onError: (error: string) => {
            console.log(error);
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
            // console.log(location?.coords);
            if (location) {
                setLocation({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                    name: '',
                });
            } else {
                const location = await Location.getCurrentPositionAsync({});
                setLocation({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                    name: '',
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
                <SectionComponent className="items-center">
                    <Text className="text-base font-medium">
                        Ứng dụng cần quyền truy cập máy ảnh để quét mã QR. Vui lòng bật quyền truy cập máy ảnh.
                    </Text>
                    <ButtonComponent
                        onPress={requestPermission}
                        title={'Ứng dụng cần quyền truy cập máy ảnh'}
                        size="medium"
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
            console.log(eventCode, dataDecrypt?.eventCode);
            Alert.alert('Thông báo', 'Mã QR không hợp lệ.', [
                {
                    text: 'Thử lại',
                    onPress: () => setScanned(false),
                },
            ]);
            return false;
        }
        if (dataDecrypt?.location) {
            const dataLocation = dataDecrypt?.location;
            const distance = getDistance(
                { latitude: location.lat, longitude: location.lng },
                { latitude: dataLocation.lat, longitude: dataLocation.lng },
            );
            if (distance > dataDecrypt?.distanceLimit && dataDecrypt?.distanceLimit !== 0) {
                Alert.alert(
                    'Thông báo',
                    `bạn cần đến gần hơn ${distance - dataDecrypt?.distanceLimit}(m) để điểm danh.`,
                    [
                        {
                            text: 'Thử lại',
                            onPress: () => setScanned(false),
                        },
                    ],
                );
                return false;
            }
        }

        if (!checkTimeActive(dataDecrypt?.startAt || 0, dataDecrypt?.endAt || 0)) {
            Alert.alert('Thông báo', 'Thời gian điểm danh không hợp lệ', [
                {
                    text: 'Thử lại',
                    onPress: () => setScanned(false),
                },
            ]);
            return false;
        }

        return true;
    };

    const handleBarCodeScanned = async ({ type, data }: any) => {
        setScanned(true);
        try {
            await sleep(1000);
            const dataDecrypt = decryptData(JSON.parse(data).data);
            if (!dataDecrypt) {
                Alert.alert('Thông báo', 'Mã QR không hợp lệ.', [
                    {
                        text: 'Thử lại',
                        onPress: () => setScanned(false),
                    },
                ]);
                return;
            }
            if (await handleCheck(dataDecrypt)) {
                try {
                    await reverseLocation(location?.lat!, location?.lng!);
                    mutate();
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            Alert.alert('Thông báo', 'Mã QR không hợp lệ.', [
                {
                    text: 'Thử lại',
                    onPress: () => setScanned(false),
                },
            ]);
        }
    };

    return (
        <ContainerComponent iconLeft="back" title="Quét mã QR">
            <CameraView
                facing="back"
                className="flex-1"
                barcodeScannerSettings={{
                    barcodeTypes: ['qr', 'pdf417'],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
                <View className="flex-1 items-center justify-center">
                    <Image
                        source={require('@/assets/images/scanner-action.png')}
                        style={{ width: 350, height: 350, alignSelf: 'center' }}
                    />
                </View>
            </CameraView>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
