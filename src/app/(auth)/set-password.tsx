import authAPI from '@/apis/authApi';
import { ButtonComponent, InputComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import ContainerComponent from '@/components/ContainerComponent';
import { LoadingModal } from '@/modals';
import { authSelector, removeOTP } from '@/stores/reducers/authReducer';
import { Regex, sleep } from '@/utils';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function SetPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const dispatch = useDispatch<any>();

    const { OTP } = useSelector(authSelector);
    const handleCheckPassword = () => {
        const isValidEmail = Regex.password.test(newPassword);
        setIsError(!isValidEmail);
    };

    const handleSetPassword = async () => {
        handleCheckPassword();
        if (isError) {
            return;
        }
        if (OTP?.done && OTP?.email) {
            setIsLoading(true);
            try {
                const res = await authAPI.HandleAuth('/reset-password', { email: OTP.email, newPassword }, 'post');
                if (res.data) {
                    await dispatch(removeOTP());
                    setIsLoading(false);
                    Alert.alert('Thành công', 'Mật khẩu đã được đặt lại thành công!', [
                        {
                            text: 'Đăng nhập',
                            onPress: () => router.push('/sign-in'),
                        },
                    ]);
                }
            } catch (error: string | any) {
                Alert.alert('Lỗi', error || 'Đã có lỗi xảy ra, vui lòng thử lại sau!');
                setIsLoading(false);
            }
        }
    };

    return (
        <ContainerComponent isAuth isScroll iconLeft="back">
            <SpaceComponent height={110} />
            <View className="px-8 pb-4 ">
                <SectionComponent align="center">
                    <TextComponent text="Tạo mật khẩu mới" title className="text-primary-400" />
                    <TextComponent
                        text="Mật khẩu mới của bạn phải khác với mật khẩu đã sử dụng trước đó."
                        className="text-center mt-4"
                    />
                </SectionComponent>
                <SectionComponent>
                    <SpaceComponent height={24} />
                    <InputComponent
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        isPassword
                        onChange={(val) => setNewPassword(val)}
                        onEnd={handleCheckPassword}
                        err={!isError ? undefined : 'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ cái và số'}
                    />
                    <SpaceComponent height={24} />
                    <ButtonComponent
                        title="Đặt lại mật khẩu"
                        size="large"
                        type="primary"
                        disabled={isError}
                        onPress={handleSetPassword}
                    />
                </SectionComponent>
            </View>
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
