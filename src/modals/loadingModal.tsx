import { colors } from '@/constants/colors';
import React from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { TextComponent } from '../components';
import { useTranslation } from 'react-i18next';

interface Props {
    message?: string;
    // onClose: () => void;
}

export default function LoadingModal(props: Props) {
    const { t } = useTranslation();
    const { message } = props;

    return (
        <Modal className='flex-1' visible={true} transparent statusBarTranslucent>
            <View className='flex-1 justify-center items-center bg-black/50'>
                <TextComponent color={colors.white} text={message || t('loading_modal_component.loading')} />
                <ActivityIndicator size={32} color={colors.white} />
            </View>
        </Modal>
    );
}
