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
import { authSelector, login } from '@/stores/reducers/authReducer';
import { checkHasErr } from '@/utils';
import { schemasCustom } from '@/utils/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Image, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export default function LoginPage() {
    const dispatch = useDispatch<any>();
    const { authData } = useSelector(authSelector);
    const { expoPushToken, notification } = usePushNotifications();
    const { t } = useTranslation();

    const schemas = schemasCustom(t);
    const schema = z.object({
        username: schemas.username,
        password: schemas.password('Login'),
    });

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

    type FormFields = z.infer<typeof schema>;

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
        onSuccess: async (data) => {
            dispatch(login(data));
            await AsyncStorage.setItem('USER_LANGUAGE', JSON.stringify(data.lang) || 'vi');
            router.navigate('/');
            Alert.alert(t('login.success_message'));
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

    return (
        <ContainerComponent isAuth isScroll className=''>
            <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
                <SpaceComponent height={137} />
                <SectionComponent align='center'>
                    <Image source={require('../../assets/images/logo-login.png')} width={125} height={125} />
                    <SpaceComponent height={6} />
                    <TextComponent text={t('login.app_name')} title className='text-primary-500 font-interSemi' />
                </SectionComponent>
                <SpaceComponent height={47} />
                <SectionComponent align='center' className='px-12'>
                    <Controller
                        name='username'
                        control={control}
                        render={({ field: { value, onBlur, onChange } }) => (
                            <InputComponent
                                testID='username'
                                placeholder={t('login.student_id_placeholder')}
                                value={value}
                                type='number-pad'
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
                        name='password'
                        control={control}
                        render={({ field: { value, onBlur, onChange } }) => (
                            <InputComponent
                                testID='password'
                                placeholder={t('login.password_placeholder')}
                                value={value}
                                type='default'
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

                    <View className='self-start flex-row justify-between items-center w-full'>
                        <Link className='ml-4 mt-2' href={'/forgot'}>
                            {t('login.forgot_password')}
                        </Link>
                    </View>
                </SectionComponent>

                <SectionComponent className='px-12'>
                    {errors.root && <TextComponent text={`${errors.root.message}`} className='text-error' />}
                    <SpaceComponent height={24} />
                    <ButtonComponent
                        title={t('login.login_button')}
                        size='large'
                        type='primary'
                        onPress={handleSubmit(onSubmit)}
                        disabled={checkHasErr(errors)}
                    />
                </SectionComponent>
            </KeyboardAwareScrollView>
            {isPending && <LoadingModal />}
        </ContainerComponent>
    );
}
