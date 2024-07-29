import eventAPI from '@/apis/eventApi';
import { checkTimeActive, decryptData, sleep } from '@/utils';
import { ButtonComponent, ContainerComponent, SectionComponent } from '@components/index';
import { useQuery } from '@tanstack/react-query';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Linking, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

export default function ScanQRScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const { id, eventCode } = useLocalSearchParams();
    const [location, setLocation] = useState<EventLocation>();

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
            console.log(location?.coords);
            if (location) {
                setLocation({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                    name: 'Vị trí hiện tại',
                });
            } else {
                const location = await Location.getCurrentPositionAsync({});
                setLocation({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                    name: 'Vị trí hiện tại',
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

    const handleCheck = async (dataDecrypt: EncryptedEventDetails | null) => {
        if (!location) {
            getCurrentLocation();
            return false;
        }
        if (eventCode !== dataDecrypt?.eventCode) {
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
            if (distance > dataDecrypt?.distanceLimit) {
                console.log(distance);
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
                // handle check in here
                // call api save to server
                Alert.alert('Thông báo', 'Điểm danh thành công.', [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.dismiss();
                        },
                    },
                ]);
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
