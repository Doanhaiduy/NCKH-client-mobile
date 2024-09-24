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
import { authSelector, setOtpValue } from '@/stores/reducers/authReducer';
import { checkHasErr, Regex, sleep } from '@/utils';
import { schemasCustom } from '@/utils/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';

const schema = z.object({
    email: schemasCustom.email,
});

type FormFields = z.infer<typeof schema>;

export default function ForGotPassWord() {
    const dispatch = useDispatch<any>();
    const {
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm<FormFields>({
        defaultValues: {
            email: 'haiduytbt2k3@gmail.com',
        },
        resolver: zodResolver(schema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (variables: FormFields) => authAPI.forgotPassword(variables),
        onSuccess: (data) => {
            console.log('data', data);
            dispatch(setOtpValue(data));
            router.push('/verification');
        },
        onError: (error: string) => {
            setError('root', { type: 'manual', message: error });
        },
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        mutate(data);
    };

    return (
        <ContainerComponent isAuth isScroll iconLeft="back">
            <SpaceComponent height={110} />
            <View className="px-8 pb-4">
                <SectionComponent align="center">
                    <TextComponent text="Quên mật khẩu?" title className="text-primary-400" />
                    <TextComponent
                        text="Vui lòng nhập địa chỉ email đã liên kết với tài khoản của bạn."
                        className="text-center mt-4"
                    />
                    <TextComponent text="Chúng tôi sẽ gửi một mã OTP." className="text-center" />
                </SectionComponent>
                <SectionComponent>
                    <SpaceComponent height={24} />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field: { value, onBlur, onChange } }) => (
                            <InputComponent
                                placeholder="Email"
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                err={errors.email?.message}
                                onFocus={() => errors.root && setError('root', { type: 'manual', message: '' })}
                            />
                        )}
                    />
                    <SpaceComponent height={12} />
                    {errors.root && <TextComponent text={`${errors.root.message}`} className="text-error" />}
                    <SpaceComponent height={12} />

                    <ButtonComponent
                        title="Gửi mã OTP"
                        size="large"
                        type="primary"
                        disabled={checkHasErr(errors)}
                        onPress={handleSubmit(onSubmit)}
                    />
                    <View className="flex-row justify-center items-center gap-1 my-4">
                        <View className="flex-1 h-[0.5px] bg-black" />
                        <TextComponent text="Hoặc" />
                        <View className="flex-1 h-[0.5px] bg-black" />
                    </View>
                    <ButtonComponent
                        title="Đăng nhập"
                        size="large"
                        type="outline"
                        onPress={() => router.dismissAll()}
                    />
                </SectionComponent>
            </View>
            <LoadingModal visible={isPending} />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
