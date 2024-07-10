import {
    ButtonComponent,
    ContainerComponent,
    InputComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

export default function SetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <ContainerComponent title="Tạo mật khẩu mới" iconLeft="back" search isScroll>
            <SectionComponent className="mt-2">
                <TextComponent text="Mật khẩu mới của bạn phải có tối thiếu 6 ký tự, bao gồm cả số, chữ cái và ký tự đặc biệt. " />
            </SectionComponent>
            <SectionComponent className="px-[56px]">
                <InputComponent value={password} onChange={setPassword} isPassword placeholder="Mật khẩu" />
                <InputComponent
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    isPassword
                    placeholder="Nhập lại mật khẩu"
                />
                <SpaceComponent height={24} />
                <ButtonComponent
                    title="Tạo mật khẩu"
                    size="large"
                    type="primary"
                    onPress={() => {
                        router.navigate('/setting');
                        Alert.alert('Tạo mật khẩu thành công!');
                    }}
                />
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
