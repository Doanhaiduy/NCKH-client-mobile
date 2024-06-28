import {
    ButtonComponent,
    ContainerComponent,
    InputComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { sleep } from '@/helpers';
import { LoadingModal } from '@/modals';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdatePassword = async () => {
        setIsLoading(true);
        await sleep(1000);
        setIsLoading(false);
        Alert.alert('Thông báo', 'Cập nhật mật khẩu thành công');
        router.back();
    };
    return (
        <ContainerComponent title="Đổi mật khẩu" iconLeft="back" search isScroll>
            <TextComponent
                text="Mật khẩu mới của bạn phải có tối thiếu 6 ký tự, bao gồm cả số, chữ cái và ký tự đặc biệt. "
                className="mt-2 mx-4"
                size={16}
            />
            <SectionComponent className="px-12">
                <SpaceComponent height={32} />
                <InputComponent
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    isPassword
                    placeholder="Mật khẩu hiện tại"
                />
                <InputComponent value={password} onChange={setPassword} isPassword placeholder="Mật khẩu" />
                <InputComponent
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    isPassword
                    placeholder="Nhập lại mật khẩu mới"
                />
                <TouchableOpacity onPress={() => router.push('setting/change-password/verification')}>
                    <TextComponent text="Quên mật khẩu?" className="mt-2 ml-5" size={14} />
                </TouchableOpacity>
            </SectionComponent>
            <SectionComponent className="px-12">
                <ButtonComponent type="primary" size="large" title="Cập nhật mật khẩu" onPress={handleUpdatePassword} />
            </SectionComponent>
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
