import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Alert, Image, Linking, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getDistance } from 'geolib';
import { Modalize } from 'react-native-modalize';
import { useMutation } from '@tanstack/react-query';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Buffer } from 'buffer';
import jsQR from 'jsqr';
import jpeg from 'jpeg-js';
import BarcodeMask from 'react-native-barcode-mask';
import axios from 'axios';

// Local imports
import eventAPI from '@/apis/eventApi';
import { decryptData, sleep } from '@/utils';
import { checkTimeActive, dateTimeFormat } from '@/utils/dateTime';
import {
    ButtonComponent,
    ContainerComponent,
    PortalizeComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@components/index';
import { colors } from '@/constants/colors';
import { LoadingModal } from '@/modals';
import { authSelector } from '@/stores/reducers/authReducer';
import { setEventNeedsRefresh } from '@/stores/reducers/refreshReducer';
import handleDetectFace from '@/services/detectApi';
import { GeoLocation } from '@/types/geoLocation';

const PNG = require('pngjs/browser').PNG;

// Constants
const DISTANCE_CHECK_INTERVAL = 5000; // 5 seconds

// Component extraction for modal contents
const PhotoInstructionsModal = ({ onClose, t }: { onClose: () => void; t: (key: string) => string }) => (
    <View className='shadow-xl gap-4 p-4 bg-white'>
        <View className='items-center'>
            <TextComponent className='text-center text-xl font-bold' text={t('scan_qr.photo_instructions_title')} />
        </View>

        <View className='mt-2'>
            {[1, 2, 3, 4, 5].map((num) => (
                <View key={`photo-instruction-${num}`} className='flex-row items-start mb-3'>
                    <Ionicons name='checkmark-circle' size={22} color={colors.primary400} style={{ marginTop: 2 }} />
                    <TextComponent className='ml-2 flex-1' text={t(`scan_qr.photo_instruction_${num}`)} />
                </View>
            ))}

            <View className='flex-row items-start mb-3'>
                <Ionicons name='warning' size={22} color={colors.error} style={{ marginTop: 2 }} />
                <TextComponent className='ml-2 flex-1' text={t('scan_qr.photo_instruction_warning')} />
            </View>
        </View>

        <View className='mt-3'>
            <ButtonComponent title={t('scan_qr.got_it')} onPress={onClose} type='primary' size='large' />
        </View>
    </View>
);

export default function ScanQRScreen() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { authData } = useSelector(authSelector);
    const [permission, requestPermission] = useCameraPermissions();
    const { id, eventCode } = useLocalSearchParams();

    // Refs
    const cameraRef = useRef<CameraView>(null);
    const modalizeRefFailed = useRef<Modalize>(null);
    const modalizeRefSuccess = useRef<Modalize>(null);
    const modalizeShowPhoto = useRef<Modalize>(null);
    const modalizeRefEventDetails = useRef<Modalize>(null);
    const modalizePhotoInstructions = useRef<Modalize>(null);
    const modalizeQRInstructions = useRef<Modalize>(null);

    // State groups
    // Camera and scanning states
    const [scanned, setScanned] = useState(false);
    const [isTakePhoto, setIsTakePhoto] = useState(false);
    const [picture, setPicture] = useState<CameraCapturedPicture | null>(null);
    const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');

    // Location states
    const [currentLocation, setCurrentLocation] = useState<EventLocation>();

    // Event and data states
    const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
    const [encryptedData, setEncryptedData] = useState<string | null>(null);

    // UI states
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    // Load event details on component mount
    useEffect(() => {
        if (!id) return;

        const fetchEventDetails = async () => {
            try {
                const data = await eventAPI.getDetailEvents(id.toString());
                setEventDetails(data);
            } catch (error) {
                Alert.alert(t('scan_qr.no_event'), t('scan_qr.no_event'), [
                    {
                        text: t('scan_qr.back'),
                        onPress: () => router.dismiss(),
                    },
                ]);
            }
        };

        fetchEventDetails();
    }, [id, t]);

    // Show QR instructions when event details are loaded
    useEffect(() => {
        if (eventDetails && modalizeQRInstructions.current) {
            setTimeout(() => {
                modalizeQRInstructions.current?.open();
            }, 1000);
        }
    }, [eventDetails]);

    // Initialize location tracking
    useEffect(() => {
        getCurrentLocation();

        // Optional: Set up periodic location updates if needed for real-time distance checking
        const intervalId = setInterval(getCurrentLocation, DISTANCE_CHECK_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

    // Check-in mutation
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
        onSuccess: () => {
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

    // Get current location with permission handling
    const getCurrentLocation = useCallback(async () => {
        try {
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
                // Try to get last known position first for faster response
                const location = await Location.getLastKnownPositionAsync({});
                if (location) {
                    setCurrentLocation({
                        lat: location.coords.latitude,
                        lng: location.coords.longitude,
                        name: currentLocation?.name || 'Not found name',
                    });
                } else {
                    const location = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced, // Balance between accuracy and battery usage
                    });
                    setCurrentLocation({
                        lat: location.coords.latitude,
                        lng: location.coords.longitude,
                        name: currentLocation?.name || 'Not found name',
                    });
                }
            }
        } catch (error) {
            console.log('Error getting location:', error);
        }
    }, [currentLocation, t]);

    // Reverse geocode to get location name
    const reverseLocation = useCallback(async (lat: number, long: number) => {
        try {
            const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi-VN&apiKey=${process
                .env.EXPO_PUBLIC_HERE_LOCATION_API_KEY!}`;
            const res = await axios<{ items: GeoLocation[] }>(api);
            if (res && res.status === 200) {
                setCurrentLocation((prev) => ({
                    ...prev!,
                    name: res.data.items[0].address.label,
                }));
            }
        } catch (error: any) {
            console.log('Reverse geocoding error:', error.message);
        }
    }, []);

    // Validate check-in requirements
    const validateCheckIn = useCallback(
        async (dataDecrypt: EncryptedEventDetails | null) => {
            // Check if location available
            if (!currentLocation) {
                await getCurrentLocation();
                return false;
            }

            // Verify event code
            const correctEventCode = eventCode || eventDetails?.eventCode;
            if (correctEventCode !== dataDecrypt?.eventCode) {
                setError(t('scan_qr.invalid_qr'));
                return false;
            }

            // Check if event is active
            if (!checkTimeActive(dataDecrypt?.startAt || 0, dataDecrypt?.endAt || 0)) {
                setError(t('scan_qr.invalid_time'));
                return false;
            }

            // Verify distance
            if (eventDetails?.location) {
                const dataLocation = eventDetails.location;
                const distance = getDistance(
                    { latitude: currentLocation.lat, longitude: currentLocation.lng },
                    { latitude: dataLocation.lat, longitude: dataLocation.lng },
                );

                // If there's a distance limit and user is outside that limit
                if (distance > eventDetails?.distanceLimit && eventDetails?.distanceLimit !== 0) {
                    setError(
                        t('scan_qr.distance_error').replace(
                            '{distance}',
                            (distance - eventDetails?.distanceLimit).toString(),
                        ),
                    );
                    return false;
                }
            }

            return true;
        },
        [currentLocation, eventCode, eventDetails, t, getCurrentLocation],
    );

    // Handle barcode scan
    const handleBarCodeScanned = useCallback(
        async ({ type, data }: any) => {
            setScanned(true);
            try {
                setLoadingMessage(t('scan_qr.processing_qr'));
                await sleep(1000);

                // Parse and decrypt data
                const dataParse = JSON.parse(data);
                const dataDecrypt = decryptData(dataParse.data);
                setEncryptedData(dataParse.data);

                if (!dataDecrypt) {
                    setError(t('scan_qr.invalid_qr'));
                    setScanned(true);
                    modalizeRefFailed.current?.open();
                    return;
                }

                // Validate check-in requirements
                const isValid = await validateCheckIn(dataDecrypt);
                if (isValid) {
                    switchToFrontCamera();
                    modalizePhotoInstructions.current?.open();
                } else {
                    modalizeRefFailed.current?.open();
                }
            } catch (error) {
                console.error('Error processing QR code:', error);
                setError(t('scan_qr.invalid_qr'));
                setScanned(true);
                modalizeRefFailed.current?.open();
            }
        },
        [t, validateCheckIn],
    );

    // Handle image upload from gallery
    const handlePickImageAndScanQR = useCallback(async () => {
        try {
            // Request permissions
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert(t('scan_qr.gallery_permission_prompt'), t('scan_qr.gallery_permission_prompt'), [
                    {
                        text: t('scan_qr.open_settings'),
                        onPress: () => {
                            Linking.openSettings();
                        },
                    },
                ]);
                return;
            }

            // Pick image
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                quality: 0.1, // Low quality for faster processing
            });

            if (result.canceled || !result.assets.length) {
                return;
            }

            setLoadingMessage(t('scan_qr.reading_qr'));
            setIsLoading(true);
            setScanned(false);

            // Process image for QR scanning
            const manipulatedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 800 } }], // Resize for performance
                {
                    compress: 0.2, // Slightly increased for better QR detection
                    format:
                        result.assets[0].mimeType === 'image/jpeg'
                            ? ImageManipulator.SaveFormat.JPEG
                            : ImageManipulator.SaveFormat.PNG,
                    base64: true,
                },
            );

            if (!manipulatedImage.base64) {
                throw new Error('Failed to process image');
            }

            // Process image data based on type
            const base64Buffer = Buffer.from(manipulatedImage.base64, 'base64');
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
                throw new Error('Unsupported image format');
            }

            if (!pixelData || !pixelData.width || !pixelData.height) {
                throw new Error('Invalid image data');
            }

            // Scan QR code in image
            const data = Uint8ClampedArray.from(imageBuffer);
            const code = jsQR(data, pixelData.width, pixelData.height);

            if (code) {
                handleBarCodeScanned({ type: 'qr', data: code.data });
            } else {
                throw new Error('No QR code found');
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error processing image:', error);
            setIsLoading(false);
            setError(t('scan_qr.no_qr_found'));
            setScanned(true);
            modalizeRefFailed.current?.open();
        }
    }, [t, handleBarCodeScanned]);

    // Take photo for verification
    const handleTakePhoto = useCallback(async () => {
        try {
            setLoadingMessage(t('scan_qr.taking_photo'));
            setIsLoading(true);
            const photo = await cameraRef?.current?.takePictureAsync({
                quality: 0.5, // Medium quality is sufficient for face detection
                skipProcessing: true, // Skip additional processing for faster capture
            });
            setPicture(photo || null);
            setIsLoading(false);
            modalizeShowPhoto.current?.open();
        } catch (error) {
            console.error('Error taking photo:', error);
            setIsLoading(false);
            Alert.alert(t('scan_qr.camera_error'));
        }
    }, [t]);

    // Submit check-in with photo verification
    const handleSubmitCheckIn = useCallback(async () => {
        modalizeQRInstructions.current?.close();
        modalizePhotoInstructions.current?.close();
        try {
            setLoadingMessage(t('scan_qr.processing_image'));
            setIsLoading(true);

            // Prepare form data for face detection
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

            if (dataDetect) {
                setLoadingMessage(t('scan_qr.checking_in'));

                // Get location name if needed
                if (currentLocation && (!currentLocation.name || currentLocation.name === 'Not found name')) {
                    await reverseLocation(currentLocation.lat, currentLocation.lng);
                }

                // Submit check-in
                const dataLocation = eventDetails?.location;
                mutate(dataLocation as EventLocation);
                modalizeShowPhoto.current?.close();
            } else {
                setError(t('scan_qr.invalid_image'));
                setScanned(true);
                modalizeShowPhoto.current?.close();
                modalizeRefFailed.current?.open();
            }
        } catch (error) {
            setError(t('scan_qr.check_in_failed_message') + `: ${error}`);
            setScanned(true);
            modalizeShowPhoto.current?.close();
            modalizeRefFailed.current?.open();
        } finally {
            setIsLoading(false);
        }
    }, [picture, currentLocation, eventDetails, authData, t, reverseLocation, mutate]);

    const switchToFrontCamera = useCallback(async () => {
        setLoadingMessage(t('scan_qr.switching_camera'));
        setIsLoading(true);

        // First set state that we're in photo mode
        setIsTakePhoto(true);

        // Add short delay to let Android properly handle camera switch
        await sleep(300);

        // Then switch camera
        setCameraFacing('front');
        setIsLoading(false);
    }, [t]);

    const switchToBackCamera = useCallback(async () => {
        setLoadingMessage(t('scan_qr.switching_camera'));
        setIsLoading(true);

        // First switch camera facing
        setCameraFacing('back');

        // Add delay to let Android properly handle camera switch
        await sleep(300);

        // Then set state that we're in QR mode
        setIsTakePhoto(false);
        setScanned(false);
        setIsLoading(false);
    }, []);

    // UI Components
    const CameraPermissionRequest = useMemo(
        () => (
            <ContainerComponent iconLeft='back' title={t('scan_qr.title')}>
                <SectionComponent className='items-center mt-6'>
                    <Text className='text-base font-medium'>{t('scan_qr.camera_permission_prompt')}</Text>
                    <SpaceComponent height={20} />
                    <ButtonComponent
                        onPress={() => {
                            if (!permission?.canAskAgain) {
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
        ),
        [permission, t, requestPermission],
    );

    // Camera UI for taking photo
    const CameraUI = useMemo(
        () => (
            <CameraView
                facing={cameraFacing}
                style={styles.camera}
                ref={cameraRef}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr', 'pdf417'],
                }}
                onBarcodeScanned={!isTakePhoto && !scanned ? handleBarCodeScanned : undefined}
            >
                {/* Camera UI content based on mode */}
                {isTakePhoto ? (
                    <>
                        {/* Photo capture UI */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={switchToBackCamera} style={styles.backButton}>
                                <Ionicons name='chevron-back' size={28} color='white' />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>{t('scan_qr.take_photo')}</Text>
                            <TouchableOpacity
                                style={styles.flashButton}
                                onPress={() => modalizePhotoInstructions.current?.open()}
                            >
                                <Entypo name='info-with-circle' size={24} color='white' />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: 280,
                                height: 300,
                                marginLeft: -140,
                                marginTop: -180,
                                borderWidth: 4,
                                borderColor: colors.white,
                                borderRadius: 150,
                                backgroundColor: 'transparent',
                            }}
                        />

                        <View
                            style={{
                                position: 'absolute',
                                top: '30%',
                                left: 0,
                                right: 0,
                                alignItems: 'center',
                            }}
                        >
                            <View style={[styles.scanInstruction, { marginTop: -100 }]}>
                                <Text style={styles.scanInstructionText}>{t('scan_qr.take_photo_instruction')}</Text>
                            </View>
                        </View>

                        <View
                            style={{
                                position: 'absolute',
                                bottom: 60,
                                left: 0,
                                right: 0,
                                alignItems: 'center',
                            }}
                        >
                            <TouchableOpacity
                                onPress={handleTakePhoto}
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 35,
                                    backgroundColor: 'white',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 4,
                                    borderColor: colors.primary400,
                                }}
                            >
                                <View
                                    style={{
                                        width: 58,
                                        height: 58,
                                        borderRadius: 29,
                                        backgroundColor: 'white',
                                        borderWidth: 1,
                                        borderColor: '#000',
                                    }}
                                />
                            </TouchableOpacity>

                            <Text
                                style={{
                                    color: 'white',
                                    marginTop: 10,
                                    fontSize: 16,
                                    fontWeight: '500',
                                }}
                            >
                                {t('scan_qr.tap_to_capture')}
                            </Text>
                        </View>
                    </>
                ) : (
                    <>
                        {/* QR scanner UI */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.dismiss()} style={styles.backButton}>
                                <Ionicons name='chevron-back' size={28} color='white' />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>{t('scan_qr.title')}</Text>
                            <TouchableOpacity
                                style={styles.flashButton}
                                onPress={() => modalizeQRInstructions.current?.open()}
                            >
                                <Entypo name='info-with-circle' size={24} color='white' />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.maskContainer}>
                            <BarcodeMask
                                width={300}
                                height={300}
                                showAnimatedLine
                                outerMaskOpacity={0.6}
                                lineAnimationDuration={1500}
                                edgeColor={colors.primary300}
                                animatedLineColor={colors.primary300}
                            />
                        </View>
                    </>
                )}
            </CameraView>
        ),
        [cameraFacing, isTakePhoto, scanned, t, handleBarCodeScanned, handleTakePhoto, switchToBackCamera],
    );

    // Show camera permission request if permission not granted
    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return CameraPermissionRequest;
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle='light-content' translucent={true} />

            {/* Main UI - combined camera view */}
            {CameraUI}

            {/* Only show bottom section for QR scanner mode */}
            {!isTakePhoto && (
                <View style={styles.bottomSection}>
                    <View style={styles.bottomButtons}>
                        <TouchableOpacity
                            style={styles.bottomButton}
                            onPress={() => modalizeRefEventDetails.current?.open()}
                        >
                            <View style={styles.bottomButtonIcon}>
                                <Ionicons name='qr-code' size={24} color='black' />
                            </View>
                            <Text style={styles.bottomButtonText}>{t('scan_qr.event_info')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.bottomButton} onPress={handlePickImageAndScanQR}>
                            <View style={styles.bottomButtonIcon}>
                                <Ionicons name='images' size={24} color='black' />
                            </View>
                            <Text style={styles.bottomButtonText}>{t('scan_qr.upload_image_button')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Modal: Failed check-in */}
            <PortalizeComponent
                onClose={async () => {
                    await sleep(1000);
                    setScanned(false);
                }}
                ref={modalizeRefFailed}
            >
                <View className='shadow-xl gap-5 p-3 bg-white'>
                    <View className='border-[2px] border-white items-center' style={{ borderRadius: 99 }}>
                        <Ionicons name='close-circle' size={100} color={colors.error} />
                    </View>
                    <View className='justify-center items-center'>
                        <TextComponent className='text-center text-xl font-bold' text={t('scan_qr.check_in_failed')} />
                        <TextComponent
                            className='mt-2 text-center text-sm max-w-[70%]'
                            text={t('scan_qr.check_in_failed_message')}
                        />
                        <TextComponent className='mt-2 text-center text-sm max-w-[70%] text-error' text={error || ''} />
                    </View>
                    <View className='flex-row justify-center'>
                        <SpaceComponent width={6} />
                        <ButtonComponent
                            title={t('scan_qr.scan_again')}
                            onPress={async () => {
                                modalizeRefFailed.current?.close();
                                await sleep(500);
                                switchToBackCamera();
                            }}
                            type='primary'
                            size='large'
                        />
                    </View>
                </View>
            </PortalizeComponent>

            {/* Modal: Successful check-in */}
            <PortalizeComponent ref={modalizeRefSuccess}>
                <View className='shadow-xl gap-5 p-3 bg-white'>
                    <View className='border-[2px] border-white items-center' style={{ borderRadius: 99 }}>
                        <Ionicons name='checkmark-circle' size={100} color={colors.primary400} />
                    </View>
                    <View className='justify-center items-center'>
                        <TextComponent className='text-center text-xl font-bold' text={t('scan_qr.check_in_success')} />
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
                                router.replace({
                                    pathname: '/attendance/list',
                                    params: { back: 'to_scan' },
                                });
                            }}
                            type='primary'
                            size='large'
                        />
                    </View>
                </View>
            </PortalizeComponent>

            {/* Modal: Photo preview */}
            <PortalizeComponent ref={modalizeShowPhoto}>
                <View className='shadow-xl gap-5 p-3 bg-white'>
                    <TextComponent className='text-center text-xl font-bold' text={t('scan_qr.photo_title')} />
                    {picture && (
                        <View className='rounded-2xl overflow-hidden border-2 border-gray-100 mb-5'>
                            <Image
                                source={{ uri: picture.uri || '' }}
                                className='w-full h-[50vh] self-center'
                                resizeMode='cover'
                            />
                            <View className='absolute top-3 right-3 bg-black/50 px-3 py-1 rounded-full'>
                                <Text className='text-white text-xs'>{t('scan_qr.preview')}</Text>
                            </View>
                        </View>
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
                    <View className='mt-6 items-center'>
                        <TextComponent
                            className='text-xs text-gray-500 text-center max-w-[90%]'
                            text={t('scan_qr.photo_note')}
                        />
                    </View>
                </View>
            </PortalizeComponent>

            {/* Modal: Event details */}
            <PortalizeComponent ref={modalizeRefEventDetails}>
                <View className='shadow-xl gap-4 p-4 bg-white'>
                    <View className='items-center'>
                        <TextComponent className='text-center text-xl font-bold' text={t('scan_qr.event_title')} />
                    </View>

                    {eventDetails ? (
                        <View className='mt-2'>
                            <View className='flex-row flex-wrap mb-3'>
                                <Ionicons name='calendar-outline' size={22} color={colors.primary400} />
                                <TextComponent className='ml-2 font-interMd' text={t('scan_qr.event_name')} />
                                <TextComponent className='ml-2 flex-1' text={eventDetails.name} />
                            </View>

                            <View className='flex-row flex-wrap mb-3'>
                                <Ionicons name='time-outline' size={22} color={colors.primary400} />
                                <TextComponent className='ml-2 font-interMd' text={t('scan_qr.event_time')} />
                                <TextComponent
                                    className='ml-2'
                                    text={`${dateTimeFormat(eventDetails.startAt)} - ${dateTimeFormat(eventDetails.endAt)}`}
                                />
                            </View>

                            <View className='flex-row flex-wrap mb-3'>
                                <Ionicons name='location-outline' size={22} color={colors.primary400} />
                                <TextComponent className='ml-2 font-interMd' text={t('scan_qr.event_location')} />
                                <TextComponent className='ml-2 flex-1' text={eventDetails.location?.name || ''} />
                            </View>

                            <View className='flex-row flex-wrap mb-3'>
                                <Ionicons name='information-circle-outline' size={22} color={colors.primary400} />
                                <TextComponent className='ml-2 font-interMd' text={t('scan_qr.event_description')} />
                                <TextComponent className='ml-2 flex-1' text={eventDetails.description || ''} />
                            </View>

                            <View className='flex-row flex-wrap mb-3'>
                                <Ionicons name='people-outline' size={22} color={colors.primary400} />
                                <TextComponent className='ml-2 font-interMd' text={t('scan_qr.event_max_attendees')} />
                                <TextComponent
                                    className='ml-2'
                                    text={eventDetails.maxAttendees?.toString() || t('scan_qr.unlimited')}
                                />
                            </View>

                            <View className='flex-row flex-wrap mb-3'>
                                <Ionicons name='navigate-outline' size={22} color={colors.primary400} />
                                <TextComponent className='ml-2 font-interMd' text={t('scan_qr.event_distance_limit')} />
                                <TextComponent
                                    className='ml-2'
                                    text={
                                        eventDetails.distanceLimit
                                            ? `${eventDetails.distanceLimit}(m)`
                                            : t('scan_qr.unlimited_distance')
                                    }
                                />
                            </View>
                        </View>
                    ) : (
                        <View className='items-center py-4'>
                            <TextComponent text={t('scan_qr.event_no_info')} />
                        </View>
                    )}

                    <View className='mt-2'>
                        <ButtonComponent
                            title={t('scan_qr.event_close')}
                            onPress={() => modalizeRefEventDetails.current?.close()}
                            type='primary'
                            size='large'
                        />
                    </View>
                </View>
            </PortalizeComponent>

            {/* Modal: Photo instructions */}
            <PortalizeComponent ref={modalizePhotoInstructions}>
                <PhotoInstructionsModal onClose={() => modalizePhotoInstructions.current?.close()} t={t} />
            </PortalizeComponent>

            {/* Modal: QR scanning instructions */}
            <PortalizeComponent ref={modalizeQRInstructions}>
                <View className='shadow-xl gap-4 p-4 bg-white'>
                    <View className='items-center'>
                        <TextComponent
                            className='text-center text-xl font-bold'
                            text={t('scan_qr.qr_instructions_title')}
                        />
                    </View>

                    <View className='mt-2'>
                        {[1, 2, 3, 4].map((num) => (
                            <View key={`qr-instruction-${num}`} className='flex-row items-start mb-3'>
                                <Ionicons
                                    name='checkmark-circle'
                                    size={22}
                                    color={colors.primary400}
                                    style={{ marginTop: 2 }}
                                />
                                <TextComponent className='ml-2 flex-1' text={t(`scan_qr.qr_instruction_${num}`)} />
                            </View>
                        ))}

                        <View className='flex-row items-start mb-3'>
                            <Ionicons
                                name='information-circle'
                                size={22}
                                color={colors.primary400}
                                style={{ marginTop: 2 }}
                            />
                            <TextComponent className='ml-2 flex-1' text={t('scan_qr.qr_instruction_5')} />
                        </View>
                    </View>

                    <View className='mt-3'>
                        <ButtonComponent
                            title={t('scan_qr.got_it')}
                            onPress={() => modalizeQRInstructions.current?.close()}
                            type='primary'
                            size='large'
                        />
                    </View>
                </View>
            </PortalizeComponent>

            {/* Loading overlay */}
            {(isPending || isLoading) && (
                <LoadingModal message={isLoading ? loadingMessage : t('scan_qr.processing_qr')} />
            )}
        </View>
    );
}

// Styles moved to bottom for better readability
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 10,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 8,
    },
    flashButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    maskContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSection: {
        backgroundColor: 'black',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    bottomButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 20,
    },
    bottomButton: {
        alignItems: 'center',
    },
    bottomButtonIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    bottomButtonText: {
        color: 'white',
        fontSize: 14,
    },
    scanInstruction: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 10,
    },
    scanInstructionText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },
});
