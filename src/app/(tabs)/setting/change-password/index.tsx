import {
    ButtonComponent,
    ContainerComponent,
    InputComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { checkHasErr } from '@/utils';
import { LoadingModal } from '@/modals';
import { router } from 'expo-router';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { schemasCustom } from '@/utils/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import authAPI from '@/apis/authApi';
import { authSelector, setOtpValue } from '@/stores/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function ResetPassword() {
    const { t } = useTranslation();
    const schemas = schemasCustom(t);

    const schema = z
        .object({
            oldPassword: schemas.password('Login'),
            newPassword: schemas.password('SignUp'),
            confirmPassword: schemas.confirmPassword,
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: t('reset_password.password_mismatch'),
            path: ['confirmPassword'],
        });

    type FormFields = z.infer<typeof schema>;

    const {
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm<FormFields>({
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        resolver: zodResolver(schema),
    });

    const { authData } = useSelector(authSelector);
    const dispatch = useDispatch<any>();

    const { mutate, isPending } = useMutation({
        mutationFn: (variables: FormChangePassword) => authAPI.changePassword(variables),
        onSuccess: async (data) => {
            Alert.alert(t('reset_password.success_title'), t('reset_password.success_message'), [
                {
                    text: t('reset_password.agree_button'),
                    onPress: () => router.back(),
                },
            ]);
        },
        onError: (error: string) => {
            setError('root', { type: 'manual', message: error });
        },
    });

    const { mutate: sendOTP, isPending: pendingOTP } = useMutation({
        mutationFn: (variables: { email: string }) => authAPI.forgotPassword(variables),
        onSuccess: (data) => {
            dispatch(setOtpValue(data));
            router.push('setting/change-password/verification');
        },
        onError: (error: string) => {
            setError('root', { type: 'manual', message: error });
        },
    });

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        mutate({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
            email: authData?.email || '',
        });
    };

    return (
        <ContainerComponent title={t('reset_password.title')} iconLeft='back' notification isScroll>
            <TextComponent text={t('reset_password.password_requirement')} className='mt-2 mx-4' size={16} />
            <SectionComponent className='px-12'>
                <SpaceComponent height={32} />
                <Controller
                    control={control}
                    name='oldPassword'
                    render={({ field: { onChange, value, onBlur } }) => (
                        <InputComponent
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            isPassword
                            placeholder={t('reset_password.current_password_placeholder')}
                            err={errors.oldPassword?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='newPassword'
                    render={({ field: { onChange, value, onBlur } }) => (
                        <InputComponent
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            isPassword
                            placeholder={t('reset_password.new_password_placeholder')}
                            err={errors.newPassword?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name='confirmPassword'
                    render={({ field: { onChange, value, onBlur } }) => (
                        <InputComponent
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            isPassword
                            placeholder={t('reset_password.confirm_password_placeholder')}
                            err={errors.confirmPassword?.message}
                        />
                    )}
                />

                <TouchableOpacity
                    onPress={() =>
                        sendOTP({
                            email: authData?.email || '',
                        })
                    }
                >
                    <TextComponent text={t('reset_password.forgot_password')} className='mt-2 ml-5' size={14} />
                </TouchableOpacity>
                {errors.root && <TextComponent text={`${errors.root.message}`} className='text-error' />}
            </SectionComponent>
            <SectionComponent className='px-12'>
                <ButtonComponent
                    type='primary'
                    size='large'
                    title={t('reset_password.update_password')}
                    onPress={handleSubmit(onSubmit)}
                    disabled={checkHasErr(errors)}
                />
            </SectionComponent>
            {isPending || pendingOTP ? <LoadingModal /> : null}
        </ContainerComponent>
    );
}
