import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Camera, useFrameProcessor, runAsync, useCameraDevice } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { Face, useFaceDetector } from 'react-native-vision-camera-face-detector';
import { colors } from '@/constants/colors';
import { t } from 'i18next';

interface LivenessFaceDetectionProps {
    onFaceDetected?: (faces: Face[]) => void;
    isActive?: boolean;
    handleTakePhoto?: () => void;
    cameraRef?: React.RefObject<Camera>;
}

const LivenessFaceDetection = ({
    onFaceDetected,
    isActive = true,
    handleTakePhoto,
    cameraRef,
}: LivenessFaceDetectionProps) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [facesDetected, setFacesDetected] = useState<Face[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [livenessState, setLivenessState] = useState<'idle' | 'checking' | 'success' | 'failed'>('idle');
    const [movementScore, setMovementScore] = useState(0);

    const faceHistoryRef = useRef<{ timestamp: number; face: Face; ear?: number }[]>([]);
    const camera = useRef<Camera>(null);
    const device = useCameraDevice('front');
    const faceDetectionOptions = useRef({
        performanceMode: 'accurate' as 'accurate',
        landmarkMode: 'all' as 'all',
        contourMode: 'all' as 'all',
        minFaceSize: 0.1,
    }).current;

    const { detectFaces } = useFaceDetector(faceDetectionOptions);

    const handleDetectedFaces = Worklets.createRunOnJS((faces: Face[]) => {
        if (faces.length === 0) {
            setFacesDetected([]);
            onFaceDetected?.([]);
            return;
        }

        const mainFace: Face = faces.reduce((prev, current) =>
            prev.bounds.width * prev.bounds.height > current.bounds.width * current.bounds.height ? prev : current,
        );

        setFacesDetected([mainFace]);
        onFaceDetected?.([mainFace]);

        faceHistoryRef.current.push({
            timestamp: Date.now(),
            face: mainFace,
        });

        if (faceHistoryRef.current.length > 30) {
            faceHistoryRef.current.shift();
        }

        detectNaturalMovement();
    });

    const detectNaturalMovement = () => {
        if (faceHistoryRef.current.length < 15) return;

        const recentFrames = faceHistoryRef.current.slice(-15);
        let totalMovement = 0;

        for (let i = 1; i < recentFrames.length; i++) {
            const prevFace: any = recentFrames[i - 1].face;
            const currFace: any = recentFrames[i].face;

            if (prevFace.landmarks && currFace.landmarks) {
                const landmarks = ['NOSE_BASE', 'LEFT_EYE', 'RIGHT_EYE'];
                landmarks.forEach((landmark) => {
                    if (prevFace.landmarks[landmark] && currFace.landmarks[landmark]) {
                        const prev = prevFace.landmarks[landmark].position;
                        const curr = currFace.landmarks[landmark].position;
                        const distance = Math.sqrt(Math.pow(prev.x - curr.x, 2) + Math.pow(prev.y - curr.y, 2));
                        totalMovement += distance;
                    }
                });
            }
        }

        const LOW_MOVEMENT_THRESHOLD = 10;
        const HIGH_MOVEMENT_THRESHOLD = 1000;

        if (totalMovement < LOW_MOVEMENT_THRESHOLD) {
            setMovementScore((prev) => Math.max(0, prev - 1));
        } else if (totalMovement > HIGH_MOVEMENT_THRESHOLD) {
            setMovementScore((prev) => Math.max(0, prev - 0.5));
        } else {
            setMovementScore((prev) => Math.min(100, prev + 0.5));
        }

        if (movementScore < 20 && livenessState === 'checking') {
            setLivenessState('failed');
        }
    };

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const frameProcessor = useFrameProcessor(
        (frame) => {
            'worklet';
            const faces = detectFaces(frame);
            handleDetectedFaces(faces);
        },
        [handleDetectedFaces],
    );

    if (error) {
        return (
            <View style={styles.fullScreenContainer}>
                <Text style={styles.text}>Lỗi: {error}</Text>
            </View>
        );
    }

    if (!device) {
        return (
            <View style={styles.fullScreenContainer}>
                <Text style={styles.text}>Đang tải camera hoặc không tìm thấy thiết bị...</Text>
            </View>
        );
    }

    if (!hasPermission) {
        return (
            <View style={styles.fullScreenContainer}>
                <Text style={styles.text}>Không có quyền truy cập camera</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                        try {
                            const permission = await Camera.requestCameraPermission();
                            setHasPermission(permission === 'granted');
                        } catch (err) {
                            console.error('Request permission error:', err);
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Yêu cầu quyền truy cập</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.fullScreenContainer}>
            <Camera
                ref={cameraRef || camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isActive}
                enableZoomGesture={true}
                frameProcessor={frameProcessor}
                onError={(err) => {
                    console.error('Camera error:', err);
                }}
                photo={true}
            />
            <View style={styles.overlay}>
                {facesDetected.map((face, index) => (
                    <View
                        key={index}
                        style={[
                            styles.faceBox,
                            {
                                left: face.bounds.x,
                                top: face.bounds.y,
                                width: face.bounds.width,
                                height: face.bounds.height,
                                borderColor:
                                    livenessState === 'success'
                                        ? colors.error
                                        : livenessState === 'failed'
                                          ? colors.error
                                          : colors.primary400,
                            },
                        ]}
                    />
                ))}
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

            <SafeAreaView style={styles.uiControlsContainer}>
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={handleTakePhoto}
                        disabled={facesDetected.length === 0}
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: 35,
                            backgroundColor: facesDetected.length === 0 ? 'gray' : 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 4,
                            borderColor: facesDetected.length === 0 ? 'gray' : colors.primary400,
                        }}
                    >
                        <View
                            style={{
                                width: 58,
                                height: 58,
                                borderRadius: 29,
                                backgroundColor: facesDetected.length === 0 ? 'gray' : 'white',
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
                        {facesDetected.length === 0 ? t('scan_qr.no_face_detected') : t('scan_qr.tap_to_capture')}
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: 'black',
        position: 'relative',
    },
    camera: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        width: '100%',
        flex: 1,
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    uiControlsContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    faceBox: {
        position: 'absolute',
        borderWidth: 3,
        borderRadius: 5,
        backgroundColor: 'transparent',
    },
    instructionContainer: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 15,
        alignItems: 'center',
    },
    instructionText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    progressContainer: {
        width: '80%',
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 10,
        marginTop: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 10,
    },
    progressText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        lineHeight: 20,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    debugContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
    },
    debugText: {
        color: 'white',
        fontSize: 14,
        marginVertical: 2,
    },
    text: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
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

export default LivenessFaceDetection;
