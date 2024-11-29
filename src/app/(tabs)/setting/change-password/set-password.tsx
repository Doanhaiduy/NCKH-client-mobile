import authAPI from '@/apis/authApi';
import {
    ButtonComponent,
    ContainerComponent,
    InputComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { LoadingModal } from '@/modals';
import { authSelector, removeOTP } from '@/stores/reducers/authReducer';
import { Regex } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function SetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isError, setIsError] = useState(false);

    const dispatch = useDispatch<any>();
    const { OTP } = useSelector(authSelector);

    const handleCheckPassword = () => {
        if (newPassword !== confirmNewPassword) {
            setIsError(true);
            return;
        }
        const isValidEmail = Regex.password.test(newPassword);
        setIsError(!isValidEmail);
    };

    const { mutate, isPending } = useMutation({
        mutationFn: (variables: FormResetPassword) => authAPI.resetPassword(variables),
        onSuccess: async (data) => {
            await dispatch(removeOTP());
            Alert.alert('Thành công', 'Mật khẩu đã được đặt lại thành công!', [
                {
                    text: 'Đồng ý',
                    onPress: () => router.dismissAll(),
                },
            ]);
        },
        onError: (error: string) => {
            Alert.alert('Lỗi', error || 'Đã có lỗi xảy ra, vui lòng thử lại sau!');
        },
    });

    const handleSetPassword = async () => {
        handleCheckPassword();
        if (isError) {
            return;
        }
        if (OTP?.done && OTP?.email) {
            mutate({ email: OTP.email, newPassword });
        }
    };

    return (
        <ContainerComponent title="Tạo mật khẩu mới" iconLeft="back" notification isScroll>
            <SectionComponent className="mt-2">
                <TextComponent text="Mật khẩu mới của bạn phải có tối thiếu 6 ký tự, bao gồm cả số, chữ cái và ký tự đặc biệt. " />
            </SectionComponent>
            <SectionComponent className="px-[56px]">
                <InputComponent
                    value={newPassword}
                    onChange={setNewPassword}
                    onEnd={handleCheckPassword}
                    isPassword
                    placeholder="Mật khẩu"
                />
                <InputComponent
                    value={confirmNewPassword}
                    onChange={setConfirmNewPassword}
                    onEnd={handleCheckPassword}
                    isPassword
                    placeholder="Nhập lại mật khẩu"
                    err={isError ? 'Mật khẩu không khớp' : undefined}
                />
                <SpaceComponent height={24} />
                <ButtonComponent
                    title="Tạo mật khẩu"
                    size="large"
                    type="primary"
                    disabled={isError}
                    onPress={handleSetPassword}
                />
            </SectionComponent>
            {isPending && <LoadingModal />}
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
