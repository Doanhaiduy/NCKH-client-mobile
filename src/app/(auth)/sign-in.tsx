import authAPI from '@/apis/authApi';
import {
    ButtonComponent,
    ContainerComponent,
    InputComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { LoadingModal } from '@/modals';
import { authSelector, login, setAuth } from '@/stores/reducers/authReducer';
import { checkHasErr } from '@/utils';
import { schemasCustom } from '@/utils/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';

// import * as LocalAuthentication from 'expo-local-authentication';

const schema = z.object({
    username: schemasCustom.username,
    password: schemasCustom.password('Login'),
});
type FormFields = z.infer<typeof schema>;

export default function LoginPage() {
    const dispatch = useDispatch<any>();
    const { authData } = useSelector(authSelector);
    const { expoPushToken, notification } = usePushNotifications();
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    const checkAuth = async () => {
        const auth = await AsyncStorage.getItem('auth');
        console.log('auth', auth);
        if (auth && authData) {
            router.navigate('(home)/');
        } else {
            return;
        }
    };

    useEffect(() => {
        checkAuth();
    }, [authData]);

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

    const { mutate, isPending } = useMutation({
        mutationFn: (variables: FormLogin) => authAPI.login(variables),
        onSuccess: (data) => {
            dispatch(login(data));
            router.navigate('/');
            Alert.alert('Đăng nhập thành công');
        },
        onError: (error: string) => {
            setError('root', {
                type: 'manual',
                message: error,
            });
        },
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const Token = expoPushToken?.data;
        mutate({ ...data, expoPushToken: Token });
    };

    // const handleBiometric = async () => {
    //     console.log('biometric');
    //     const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
    //     if (!isBiometricAvailable) {
    //         Alert.alert('Biometric is not available');
    //         return;
    //     }
    //     let supportedBiometric;
    //     if (isBiometricAvailable) {
    //         supportedBiometric = await LocalAuthentication.supportedAuthenticationTypesAsync();
    //     }

    //     const saveBiometrics = await LocalAuthentication.isEnrolledAsync();
    //     console.log('saveBiometrics', saveBiometrics);
    //     if (!saveBiometrics) {
    //         Alert.alert('No biometric data found');
    //         return;
    //     }

    //     const biometric = await LocalAuthentication.authenticateAsync({
    //         promptMessage: 'Login with biometric',
    //         cancelLabel: 'Cancel',
    //         disableDeviceFallback: true,
    //     });

    //     console.log('biometric', biometric);
    //     if (biometric.success) {
    //         Alert.alert('Biometric success');
    //     } else {
    //         Alert.alert('Biometric failed');
    //     }
    // };

    // useEffect(() => {
    //     async () => {
    //         const compatible = await LocalAuthentication.hasHardwareAsync();
    //         setIsBiometricSupported(compatible);
    //     };
    // }, []);

    console.log('isBiometricSupported', isBiometricSupported);

    return (
        <ContainerComponent isAuth isScroll className="">
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
                <SpaceComponent height={137} />
                <SectionComponent align="center">
                    <Image source={require('../../assets/images/logo-login.png')} width={125} height={125} />
                    <SpaceComponent height={6} />
                    <TextComponent text="NTU Student" title className="text-primary-500 font-interSemi" />
                </SectionComponent>
                <SpaceComponent height={47} />
                <SectionComponent align="center" className="px-12">
                    <Controller
                        name="username"
                        control={control}
                        render={({ field: { value, onBlur, onChange } }) => (
                            <InputComponent
                                testID="username"
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
                                testID="password"
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

                    <View className="self-start flex-row justify-between items-center w-full">
                        <Link className="ml-4 mt-2" href={'/forgot'}>
                            Quên mật khẩu
                        </Link>
                        {/* <TouchableOpacity className='pt-2' onPress={handleBiometric}>
                            <MaterialCommunityIcons name='face-recognition' size={35} color={colors.primary400} />
                        </TouchableOpacity> */}
                    </View>
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
            {isPending && <LoadingModal />}
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
