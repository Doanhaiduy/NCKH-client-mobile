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
import { login } from '@/stores/actions/authAction';
import { authSelector } from '@/stores/reducers/authReducer';
// import { authErrorSelector, authLoadingSelector, authSelector } from '@/stores/reducers/authReducer';
import { checkHasErr } from '@/utils';
import { schemasCustom } from '@/utils/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Image, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';

const schema = z.object({
    username: schemasCustom.username,
    password: schemasCustom.password('Login'),
});
type FormFields = z.infer<typeof schema>;

export default function LoginPage() {
    const dispatch = useDispatch<any>();
    const { isLoading, authData } = useSelector(authSelector);

    useEffect(() => {
        console.log('authData', authData);
        if (authData) {
            router.navigate('(home)/');
            Alert.alert('Đăng nhập thành công');
        }
    }, [authData]);

    const {
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm<FormFields>({
        defaultValues: {
            username: '63130261',
            password: 'haiduy10',
        },
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const { username, password } = data;
        const { payload } = await dispatch(login({ username, password }));
        console.log('payload', payload);
        if (payload.authData) {
            router.navigate('(home)/');
        } else {
            setError('root', {
                type: 'manual',
                message: payload,
            });
        }
    };

    return (
        <ContainerComponent isAuth isScroll className="">
            <KeyboardAwareScrollView>
                <SpaceComponent height={137} />
                <SectionComponent align="center">
                    <Image source={require('../../assets/images/logo-login.png')} width={125} height={125} />
                    <SpaceComponent height={6} />
                    <TextComponent text="Information Technology" title className="text-primary-500 font-interSemi" />
                </SectionComponent>
                <SpaceComponent height={47} />

                <SectionComponent align="center" className=" px-12">
                    <Controller
                        name="username"
                        control={control}
                        render={({ field: { value, onBlur, onChange } }) => (
                            <InputComponent
                                placeholder="Mã số sinh viên"
                                value={value}
                                type="number-pad"
                                onChange={onChange}
                                onFocus={() =>
                                    errors.root &&
                                    setError('root', {
                                        type: 'manual',
                                        message: '',
                                    })
                                }
                                onBlur={onBlur}
                                err={errors.username?.message}
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field: { value, onBlur, onChange } }) => (
                            <InputComponent
                                placeholder="Mật khẩu"
                                value={value}
                                type="default"
                                onChange={onChange}
                                isPassword
                                onFocus={() =>
                                    errors.root &&
                                    setError('root', {
                                        type: 'manual',
                                        message: '',
                                    })
                                }
                                onBlur={onBlur}
                                err={errors.password?.message}
                            />
                        )}
                    />

                    <Link className="self-start ml-4 mt-2" href={'/forgot'}>
                        Quên mật khẩu
                    </Link>
                </SectionComponent>

                <SectionComponent className="px-12">
                    {errors.root && <TextComponent text={`${errors.root.message}`} className="text-error" />}
                    <SpaceComponent height={24} />
                    <ButtonComponent
                        title="Đăng nhập"
                        size="large"
                        type="primary"
                        onPress={handleSubmit(onSubmit)}
                        disabled={checkHasErr(errors)}
                    />
                </SectionComponent>
            </KeyboardAwareScrollView>
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
