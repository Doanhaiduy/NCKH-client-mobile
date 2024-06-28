import { sleep } from '@/utils';
import { ButtonComponent, ContainerComponent, SectionComponent } from '@components/index';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

export default function ScanQRScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const { id } = useLocalSearchParams();

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

    const handelAddAttendance = async (dataDecrypt: any) => {};

    const handleBarCodeScanned = async ({ type, data }: any) => {
        setScanned(true);
        await sleep(1000);
        Alert.alert('Thông báo', 'Điểm danh thành công: ' + data, [
            {
                text: 'OK',
                onPress: () => {
                    router.dismissAll();
                },
            },
            {
                text: 'Quét lại',
                onPress: () => {
                    setScanned(false);
                },
            },
        ]);
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
