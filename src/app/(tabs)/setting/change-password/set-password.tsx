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
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function SetPassword() {
    const { t } = useTranslation();
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
            router.dismissAll();
            Alert.alert(t('set_password_v2.success_title'), t('set_password_v2.success_message'));
        },
        onError: (error: string) => {
            Alert.alert(t('set_password_v2.error_title'), error || t('set_password_v2.error_message'));
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
        <ContainerComponent title={t('set_password_v2.title')} iconLeft='back' notification isScroll>
            <SectionComponent className='mt-2'>
                <TextComponent text={t('set_password_v2.password_requirement')} />
            </SectionComponent>
            <SectionComponent className='px-[56px]'>
                <InputComponent
                    value={newPassword}
                    onChange={setNewPassword}
                    onEnd={handleCheckPassword}
                    isPassword
                    placeholder={t('set_password_v2.new_password_placeholder')}
                />
                <InputComponent
                    value={confirmNewPassword}
                    onChange={setConfirmNewPassword}
                    onEnd={handleCheckPassword}
                    isPassword
                    placeholder={t('set_password_v2.confirm_password_placeholder')}
                    err={isError ? t('set_password_v2.password_mismatch') : undefined}
                />
                <SpaceComponent height={24} />
                <ButtonComponent
                    title={t('set_password_v2.create_password_button')}
                    size='large'
                    type='primary'
                    disabled={isError}
                    onPress={handleSetPassword}
                />
            </SectionComponent>
            {isPending && <LoadingModal />}
        </ContainerComponent>
    );
}
