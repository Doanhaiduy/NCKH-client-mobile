import eventAPI from '@/apis/eventApi';
import { decryptData, sleep } from '@/utils';
import { checkTimeActive } from '@/utils/dateTime';
import {
    ButtonComponent,
    ContainerComponent,
    PortalizeComponent,
    SectionComponent,
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

export default function ScanQRScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const { id, eventCode } = useLocalSearchParams();
    const [location, setLocation] = useState<EventLocation>();
    const { authData } = useSelector(authSelector);
    const modalizeRef = useRef<Modalize>(null);

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
        if (!checkTimeActive(dataDecrypt?.startAt || 0, dataDecrypt?.endAt || 0)) {
            Alert.alert('Thông báo', 'Thời gian điểm danh không hợp lệ', [
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
                    const dataLocation = dataDecrypt?.location;
                    mutate(dataLocation);
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
            <TouchableOpacity
                className="absolute top-5 right-5 bg-white p-2 rounded-full"
                onPress={() => {
                    console.log('open modal');
                    modalizeRef.current?.open();
                }}
            >
                <Ionicons name="camera" size={32} color="black" />
            </TouchableOpacity>

            <PortalizeComponent
                ref={modalizeRef}
                children={
                    <View className="shadow-xl gap-5 p-3 bg-white">
                        <TouchableOpacity
                            className="flex-row  items-center"
                            onPress={() => {
                                modalizeRef.current?.close();
                            }}
                        >
                            <Ionicons name="image" size={22} color="black" />
                            <TextComponent text="Chọn từ thư viện" className="ml-2 font-medium" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-row py-2 items-center"
                            onPress={() => {
                                modalizeRef.current?.close();
                            }}
                        >
                            <Ionicons name="camera" size={24} color="black" />
                            <TextComponent text="Chụp ảnh" className="ml-2 font-medium" />
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({});
