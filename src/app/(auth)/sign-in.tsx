import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import {
    ButtonComponent,
    ContainerComponent,
    InputComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { LoadingModal } from '@/modals';
import { checkHasErr, sleep } from '@/utils';
import { Link, router } from 'expo-router';
import { Controller, SubmitHandler, set, useForm } from 'react-hook-form';
import { z } from 'zod';
import { schemasCustom } from '@/utils/zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    username: schemasCustom.username,
    password: schemasCustom.password('Login'),
});
type FormFields = z.infer<typeof schema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm<FormFields>({
        defaultValues: {
            username: '',
            password: '',
        },
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setIsLoading(true);
        try {
            console.log(data);
            await sleep(2000);
            Alert.alert('Đăng nhập thành công!', '', [
                {
                    text: 'OK',
                    onPress: () => router.push('(drawer)'),
                },
            ]);
            setIsLoading(false);
        } catch (error) {
            setError('root', {
                message: 'Mã số sinh viên hoặc mật khẩu không chính xác',
            });
            setIsLoading(false);
        }
    };

    return (
        <ContainerComponent isAuth isScroll className=''>
            {/* <StatusBar style='auto' /> */}
            <SpaceComponent height={147} />
            <SectionComponent align='center'>
                <Image source={require('../../assets/images/logo-login.png')} width={125} height={125} />
                <SpaceComponent height={6} />
                <TextComponent text='Information Technology' title className='text-primary-400' />
            </SectionComponent>
            <SpaceComponent height={47} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'position' : 'height'}
                keyboardVerticalOffset={20}
                style={{ flex: 1 }}
            >
                <SectionComponent align='center' className=' px-12'>
                    <Controller
                        name='username'
                        control={control}
                        render={({ field: { value, onBlur, onChange } }) => (
                            <InputComponent
                                placeholder='Mã số sinh viên'
                                value={value}
                                type='number-pad'
                                onChange={onChange}
                                onBlur={onBlur}
                                err={errors.username?.message}
                            />
                        )}
                    />
                    <Controller
                        name='password'
                        control={control}
                        render={({ field: { value, onBlur, onChange } }) => (
                            <InputComponent
                                placeholder='Mật khẩu'
                                value={value}
                                type='default'
                                onChange={onChange}
                                isPassword
                                onBlur={onBlur}
                                err={errors.password?.message}
                            />
                        )}
                    />

                    <Link className='self-start ml-4 mt-2' href={'/forgot'}>
                        Quên mật khẩu
                    </Link>
                </SectionComponent>
            </KeyboardAvoidingView>
            <SectionComponent className='px-12'>
                {errors.root && <TextComponent text={`${errors.root.message}`} className='text-error' />}
                <SpaceComponent height={24} />
                <ButtonComponent
                    title='Đăng nhập'
                    size='large'
                    type='primary'
                    onPress={handleSubmit(onSubmit)}
                    disabled={checkHasErr(errors)}
                />
            </SectionComponent>
            {/* <SectionComponent align='center' className='mt-[128px] pb-12'>
                <RowComponent>
                    <TextComponent text='Tiếng việt' />
                    <Ionicons name='chevron-down' size={24} color={colors['text-800']} />
                </RowComponent>
            </SectionComponent> */}
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
