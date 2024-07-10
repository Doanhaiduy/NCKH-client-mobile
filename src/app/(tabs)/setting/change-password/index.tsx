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

const schema = z
    .object({
        currentPassword: schemasCustom.password('Login'),
        newPassword: schemasCustom.password('SignUp'),
        confirmPassword: schemasCustom.confirmPassword,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
    });

type FormFields = z.infer<typeof schema>;
export default function ResetPassword() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormFields>({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
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
                <Controller
                    control={control}
                    name="currentPassword"
                    render={({ field: { onChange, value, onBlur } }) => (
                        <InputComponent
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            isPassword
                            placeholder="Mật khẩu hiện tại"
                            err={errors.currentPassword?.message}
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

                <TouchableOpacity onPress={() => router.push('setting/change-password/verification')}>
                    <TextComponent text="Quên mật khẩu?" className="mt-2 ml-5" size={14} />
                </TouchableOpacity>
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
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
