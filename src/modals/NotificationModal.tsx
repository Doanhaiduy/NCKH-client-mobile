import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { ButtonComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';

type Props = {
    visible: boolean;
    onClose: () => void;
    onDetails: () => void;
};

const NotificationModal = (props: Props) => {
    const { visible, onClose, onDetails } = props;

    return (
        <Modal transparent statusBarTranslucent visible={visible}>
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="w-[95%] bg-white aspect-square rounded-[48px] items-center justify-center px-4 py-10">
                    <TouchableOpacity className="absolute top-8 right-8" onPress={onClose}>
                        <AntDesign name="close" size={30} color="black" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Entypo name="bell" size={90} color="black" />
                        <TextComponent text="Tin tức" title className="my-2" />
                        <TextComponent text="Hôm nay, 15:30" color={colors.text300} />
                    </View>
                    <TextComponent
                        text="Lịch thi đấu chính thức giải bóng chuyền nam  - nữ sinh viên NTU 2024"
                        className="my-4 mb-8"
                    />
                    <View className="flex-1 w-full px-6">
                        <ButtonComponent type="primary" size="large" title="Xem chi tiết" onPress={onDetails} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default NotificationModal;

const styles = StyleSheet.create({});
