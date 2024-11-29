import React from 'react';
import { View, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import Animated, { useSharedValue, withSpring, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

interface Props {
    url: string;
    rounded?: number;
    isShowModal: boolean;
    onClose: () => void;
    onDownload: () => void;
}

const ImageModal = ({ url, rounded, isShowModal, onClose, onDownload }: Props) => {
    const scale = useSharedValue(0.8);

    // Start scale-up animation on open
    const openModal = () => {
        scale.value = withSpring(1);
    };

    // Animated style for the image
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // Handle swipe down gesture to close modal
    const onGestureEvent = ({ nativeEvent }: { nativeEvent: { translationY: number } }) => {
        if (nativeEvent.translationY > 100) {
            closeModal();
        }
    };

    // Function to close modal and reset animation
    const closeModal = () => {
        scale.value = withSpring(0.8, {}, () => {
            runOnJS(onClose)();
        });
    };

    return (
        <Modal visible={isShowModal} transparent onShow={openModal}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <PanGestureHandler onGestureEvent={onGestureEvent}>
                    <Animated.View style={[{ width: '100%', height: '100%' }, animatedStyle]}>
                        <Image
                            source={{ uri: url }}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: rounded,
                                resizeMode: 'contain',
                            }}
                        />
                    </Animated.View>
                </PanGestureHandler>
                <View
                    style={{
                        position: 'absolute',
                        top: 30,
                        left: 0,
                        flexDirection: 'row',
                        padding: 20,
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={closeModal}
                        className=" p-4 bg-black/30"
                        style={{
                            borderRadius: 99,
                        }}
                    >
                        <AntDesign name="closecircle" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onDownload}
                        className=" p-4 bg-black/30"
                        style={{
                            borderRadius: 99,
                        }}
                    >
                        <Entypo name="download" size={28} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ImageModal;
