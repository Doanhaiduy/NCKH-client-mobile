import {
    ButtonComponent,
    ContainerComponent,
    InputComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { checkHasErr, sleep } from '@/utils';
import { LoadingModal } from '@/modals';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { schemasCustom } from '@/utils/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import authAPI from '@/apis/authApi';
import { authSelector, setOtpValue } from '@/stores/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';

const schema = z
    .object({
        oldPassword: schemasCustom.password('Login'),
        newPassword: schemasCustom.password('SignUp'),
        confirmPassword: schemasCustom.confirmPassword,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
    });

type FormFields = z.infer<typeof schema>;
export default function ResetPassword() {
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
            Alert.alert('Thành công', 'Cập nhật mật khẩu thành công!', [
                {
                    text: 'Đồng ý',
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
            console.log('data', data);
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
        <ContainerComponent title="Đổi mật khẩu" iconLeft="back" search isScroll>
            <TextComponent
                text="Mật khẩu mới của bạn phải có tối thiếu 6 ký tự, bao gồm cả số, chữ cái và ký tự đặc biệt. "
                className="mt-2 mx-4"
                size={16}
            />
            <SectionComponent className="px-12">
                <SpaceComponent height={32} />
                <Controller
                    control={control}
                    name="oldPassword"
                    render={({ field: { onChange, value, onBlur } }) => (
                        <InputComponent
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            isPassword
                            placeholder="Mật khẩu hiện tại"
                            err={errors.oldPassword?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="newPassword"
                    render={({ field: { onChange, value, onBlur } }) => (
                        <InputComponent
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            isPassword
                            placeholder="Mật khẩu mới"
                            err={errors.newPassword?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, value, onBlur } }) => (
                        <InputComponent
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            isPassword
                            placeholder="Nhập lại mật khẩu mới"
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
                    <TextComponent text="Quên mật khẩu?" className="mt-2 ml-5" size={14} />
                </TouchableOpacity>
                {errors.root && <TextComponent text={`${errors.root.message}`} className="text-error" />}
            </SectionComponent>
            <SectionComponent className="px-12">
                <ButtonComponent
                    type="primary"
                    size="large"
                    title="Cập nhật mật khẩu"
                    onPress={handleSubmit(onSubmit)}
                    disabled={checkHasErr(errors)}
                />
            </SectionComponent>
            <LoadingModal visible={isPending || pendingOTP} />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
