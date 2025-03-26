import { Modal, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { ButtonComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { dateFormatLocale } from '@/utils/dateTime';
import { useTranslation } from 'react-i18next';

type Props = {
    visible: boolean;
    onClose: () => void;
    onDetails: () => void;
    data: _Notification | null;
};

const NotificationModal = (props: Props) => {
    const { t } = useTranslation();
    const { visible, onClose, onDetails, data } = props;

    return (
        <Modal transparent statusBarTranslucent visible={visible}>
            <View className='flex-1 justify-center items-center bg-black/50'>
                <View className='w-[95%] bg-white rounded-[48px] items-center justify-center px-4 py-10'>
                    <TouchableOpacity className='absolute top-8 right-8' onPress={onClose}>
                        <AntDesign name='close' size={30} color='black' />
                    </TouchableOpacity>
                    <View className='items-center'>
                        <Entypo name='bell' size={90} color='black' />
                        <TextComponent
                            text={data?.message?.toString() || ''}
                            numberOfLines={3}
                            title
                            className='my-2 text-center'
                        />
                        <TextComponent
                            text={data?.createdAt ? dateFormatLocale(data.createdAt) : ''}
                            color={colors.text300}
                        />
                    </View>
                    <TextComponent text={data?.description?.toString() || ''} numberOfLines={4} className='my-4 mb-8' />
                    <View className='flex-1 w-full px-6 mt-5'>
                        <ButtonComponent
                            type='primary'
                            size='large'
                            title={t('notification_modal_component.view_details')}
                            onPress={onDetails}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default NotificationModal;
