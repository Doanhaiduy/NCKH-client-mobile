import { Alert, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import ContainerComponent from '@/components/ContainerComponent';
import {
    ButtonComponent,
    InputComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { LoadingModal } from '@/modals';
import { Regex, sleep } from '@/utils';

export default function SetPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isError, setIsError] = useState(false);

    const handleCheckPassword = () => {
        const isValidEmail = Regex.password.test(newPassword);
        setIsError(!isValidEmail);
    };

    const handleSetPassword = async () => {
        setIsLoading(true);
        try {
            console.log('New password: ', newPassword);
            await sleep(1000);
            console.log('Set password successfully!');
            setIsLoading(false);
            Alert.alert('Đặt mật khẩu thành công!', 'Vui lòng đăng nhập bằng mật khẩu mới của bạn.', [
                {
                    text: 'OK',
                    onPress: () => router.push('/sign-in'),
                },
            ]);
        } catch (error) {
            console.log('Can not set password! ', error);
            setIsLoading(false);
        }
    };

    return (
        <ContainerComponent isAuth isScroll iconLeft='back'>
            <SpaceComponent height={120} />
            <View className='px-8 pb-4 '>
                <SectionComponent align='center'>
                    <TextComponent text='Tạo mật khẩu mới' title className='text-primary-400' />
                    <TextComponent
                        text='Mật khẩu mới của bạn phải khác với mật khẩu đã sử dụng trước đó.'
                        className='text-center mt-4'
                    />
                </SectionComponent>
                <SectionComponent>
                    <SpaceComponent height={24} />
                    <InputComponent
                        placeholder='Mật khẩu mới'
                        value={newPassword}
                        isPassword
                        onChange={(val) => setNewPassword(val)}
                        onEnd={handleCheckPassword}
                        err={!isError ? undefined : 'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ cái và số'}
                    />
                    <SpaceComponent height={24} />
                    <ButtonComponent title='Đặt lại mật khẩu' size='large' type='primary' onPress={handleSetPassword} />
                </SectionComponent>
            </View>
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
