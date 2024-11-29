import { colors } from '@/constants/colors';
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { TextComponent } from '../components';

interface Props {
    message?: string;
    // onClose: () => void;
}

export default function LoadingModal(props: Props) {
    const { message } = props;

    return (
        <Modal className="flex-1" visible={true} transparent statusBarTranslucent>
            <View className="flex-1 justify-center items-center bg-black/50">
                <TextComponent color={colors.white} text={message || 'Đang tải...'} />
                <ActivityIndicator size={32} color={colors.white} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({});
