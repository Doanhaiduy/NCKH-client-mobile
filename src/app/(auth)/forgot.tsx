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
import { setOtpValue } from '@/stores/reducers/authReducer';
import { checkHasErr } from '@/utils';
import { schemasCustom } from '@/utils/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { z } from 'zod';

const ForGotPassWord = () => {
    const dispatch = useDispatch<any>();
    const { t } = useTranslation();

    const schemas = schemasCustom(t);
    const schema = z.object({
        email: schemas.email,
    });

    type FormFields = z.infer<typeof schema>;

    const {
        handleSubmit,
        setError,
        control,
        formState: { errors },
    } = useForm<FormFields>({
        defaultValues: {
            email: '',
        },
        resolver: zodResolver(schema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (variables: FormFields) => authAPI.forgotPassword(variables),
        onSuccess: (data) => {
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
        <ContainerComponent isAuth isScroll iconLeft='back'>
            <SpaceComponent height={110} />
            <View className='px-8 pb-4'>
                <SectionComponent align='center'>
                    <TextComponent text={t('forgot.forgot_password')} title className='text-primary-500' />
                    <TextComponent text={t('forgot.enter_email')} className='text-center mt-4' />
                    <TextComponent text={t('forgot.send_otp_info')} className='text-center' />
                </SectionComponent>
                <SectionComponent>
                    <SpaceComponent height={24} />
                    <Controller
                        name='email'
                        control={control}
                        render={({ field: { value, onBlur, onChange } }) => (
                            <InputComponent
                                placeholder={t('forgot.email_placeholder')}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                err={errors.email?.message}
                                onFocus={() => errors.root && setError('root', { type: 'manual', message: '' })}
                            />
                        )}
                    />
                    <SpaceComponent height={12} />
                    {errors.root && <TextComponent text={`${errors.root.message}`} className='text-error' />}
                    <SpaceComponent height={12} />

                    <ButtonComponent
                        title={t('forgot.send_otp')}
                        size='large'
                        type='primary'
                        disabled={checkHasErr(errors)}
                        onPress={handleSubmit(onSubmit)}
                    />
                    <View className='flex-row justify-center items-center gap-1 my-4'>
                        <View className='flex-1 h-[0.5px] bg-black' />
                        <TextComponent text={t('forgot.or')} />
                        <View className='flex-1 h-[0.5px] bg-black' />
                    </View>
                    <ButtonComponent
                        title={t('forgot.login')}
                        size='large'
                        type='primary'
                        onPress={() => router.dismissAll()}
                    />
                </SectionComponent>
            </View>
            {isPending && <LoadingModal />}
        </ContainerComponent>
    );
};

export default ForGotPassWord;
