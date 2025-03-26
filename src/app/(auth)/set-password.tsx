import authAPI from '@/apis/authApi';
import { ButtonComponent, InputComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import ContainerComponent from '@/components/ContainerComponent';
import { LoadingModal } from '@/modals';
import { authSelector, removeOTP } from '@/stores/reducers/authReducer';
import { Regex } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function SetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const dispatch = useDispatch<any>();
    const { t } = useTranslation();

    const { OTP } = useSelector(authSelector);
    const handleCheckPassword = () => {
        const isValidEmail = Regex.password.test(newPassword);
        setIsError(!isValidEmail);
    };

    const { mutate, isPending } = useMutation({
        mutationFn: (variables: FormResetPassword) => authAPI.resetPassword(variables),
        onSuccess: async (data) => {
            await dispatch(removeOTP());
            router.dismissTo('/sign-in');
            Alert.alert(t('set_password.success_title'), t('set_password.success_message'));
        },
        onError: (error: string) => {
            Alert.alert(t('set_password.error_title'), error || t('set_password.error_message'));
        },
    });

    const handleSetPassword = async () => {
        handleCheckPassword();
        if (isError) {
            return;
        }
        if (OTP?.done && OTP?.email) {
            mutate({ newPassword, resetToken: OTP.resetToken });
        }
    };

    return (
        <ContainerComponent
            isAuth
            isScroll
            iconLeft='back'
            onBack={() => {
                dispatch(removeOTP());
                router.dismissTo('/forgot');
            }}
        >
            <SpaceComponent height={110} />
            <View className='px-8 pb-4'>
                <SectionComponent align='center'>
                    <TextComponent text={t('set_password.create_new_password')} title className='text-primary-500' />
                    <TextComponent text={t('set_password.password_requirement')} className='text-center mt-4' />
                </SectionComponent>
                <SectionComponent>
                    <SpaceComponent height={24} />
                    <InputComponent
                        placeholder={t('set_password.new_password_placeholder')}
                        value={newPassword}
                        isPassword
                        onChange={(val) => setNewPassword(val)}
                        onEnd={handleCheckPassword}
                        err={!isError ? undefined : t('set_password.password_error')}
                    />
                    <SpaceComponent height={24} />
                    <ButtonComponent
                        title={t('set_password.reset_password')}
                        size='large'
                        type='primary'
                        disabled={isError}
                        onPress={handleSetPassword}
                    />
                </SectionComponent>
            </View>
            {isPending && <LoadingModal />}
        </ContainerComponent>
    );
}
