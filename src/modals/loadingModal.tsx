import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TextComponent } from '../components';
import { colors } from '@/constants/colors';

interface Props {
    visible: boolean;
    message?: string;
    // onClose: () => void;
}

export default function LoadingModal(props: Props) {
    const { visible, message } = props;

    return (
        <Modal className='flex-1' visible={visible} transparent statusBarTranslucent>
            <View className='flex-1 justify-center items-center bg-black/50'>
                <TextComponent className='text-white' text='Loading...' />
                <ActivityIndicator size={32} color={colors.white} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({});
