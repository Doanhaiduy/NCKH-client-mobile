import authAPI from '@/apis/authApi';
import { ButtonComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import ContainerComponent from '@/components/ContainerComponent';
import { colors } from '@/constants/colors';
import { LoadingModal } from '@/modals';
import { authSelector, setDoneVerify, setOtpValue } from '@/stores/reducers/authReducer';
import { obfuscateEmail, sleep } from '@/utils';
import { checkExpiredTime, getSecondTimeLimit } from '@/utils/dateTime';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function VerificationPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [expiredTime, setExpiredTime] = useState(0);
    const { OTP } = useSelector(authSelector);
    const otpRef = React.useRef<OtpInputRef>(null);
    const dispatch = useDispatch<any>();
    const { t } = useTranslation();

    useEffect(() => {
        if (!checkExpiredTime(OTP?.expiredIn || 0)) {
            setExpiredTime(getSecondTimeLimit(OTP?.expiredIn || 0));
        }
    }, [OTP]);

    useEffect(() => {
        if (expiredTime > 0) {
            const interval = setInterval(() => {
                setExpiredTime((expiredTime) => expiredTime - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [expiredTime]);

    const handleVerification = async (text?: string) => {
        setIsLoading(true);
        const inputOtp: string = text || otp;
        if (inputOtp.length !== 6) {
            setError(t('verification.invalid_otp'));
            setIsLoading(false);
            return;
        }
        verifyOTP({ email: OTP?.email || '', otp: inputOtp });
        setIsLoading(false);
    };

    const { mutate: verifyOTP, isPending: isVerifying } = useMutation({
        mutationFn: (variables: { email: string; otp: string }) => authAPI.verifyOTP(variables),
        onSuccess: async (data) => {
            await sleep(500);
            console.log({
                resetToken: data.resetToken,
            });
            dispatch(
                setDoneVerify({
                    resetToken: data.resetToken,
                }),
            );
            router.push('/set-password');
            setError('');
        },
        onError: (error: string) => {
            setError(error);
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (variables: { email: string }) => authAPI.forgotPassword(variables),
        onSuccess: (data) => {
            dispatch(setOtpValue(data));
            setError('');
            setOtp('');
            otpRef.current?.clear();
        },
        onError: (error: string) => {
            setError(error);
        },
    });

    const handleResendOTP = async () => {
        mutate({
            email: OTP?.email || '',
        });
        otpRef.current?.focus();
    };

    return (
        <ContainerComponent isAuth isScroll iconLeft='back'>
            <SpaceComponent height={120} />
            <View className='px-8 pb-4'>
                <SectionComponent align='center'>
                    <TextComponent text={t('verification.verify_email')} title className='text-primary-500' />
                    <TextComponent
                        text={t('verification.otp_sent').replace('{email}', obfuscateEmail(OTP?.email || ''))}
                        className='text-center mt-4'
                    />
                    <TextComponent text={t('verification.check_and_enter')} className='text-center' />
                </SectionComponent>
                <SectionComponent className='items-center'>
                    <SpaceComponent height={24} />
                    <OtpInput
                        ref={otpRef}
                        numberOfDigits={6}
                        autoFocus
                        focusColor={error ? colors.error : colors.primary400}
                        onTextChange={(text) => {
                            setOtp(text);
                            setError('');
                        }}
                        onFilled={(text) => handleVerification(text)}
                        theme={{
                            pinCodeContainerStyle: {
                                width: 40,
                                height: 56,
                                backgroundColor: colors['white'],
                                borderColor: error ? colors.error : colors.primary400,
                            },
                            containerStyle: {
                                justifyContent: 'center',
                                gap: 12,
                                width: '100%',
                            },
                        }}
                    />
                    <SpaceComponent height={12} />
                    {error ? <TextComponent text={error} size={11} color={colors.error} /> : null}
                    <SpaceComponent height={12} />
                    <ButtonComponent
                        title={t('verification.verify_button')}
                        disabled={otp.length < 6}
                        size='large'
                        type='primary'
                        onPress={() => handleVerification(undefined)}
                    />

                    <SpaceComponent height={12} />

                    {expiredTime > 0 ? (
                        <TextComponent
                            text={t('verification.otp_expires_in').replace('{seconds}', expiredTime.toString())}
                            size={11}
                            color={colors.error}
                        />
                    ) : (
                        <SectionComponent align='center' className='w-full'>
                            <TextComponent text={t('verification.resend_prompt')} className='text-sm' />
                            <TouchableOpacity onPress={handleResendOTP}>
                                <TextComponent text={t('verification.resend')} className='text-sm text-primary-500' />
                            </TouchableOpacity>
                        </SectionComponent>
                    )}

                    <SpaceComponent height={12} />

                    {isPending || isLoading || isVerifying ? <LoadingModal /> : null}
                    <SpaceComponent height={50} />
                </SectionComponent>
            </View>
        </ContainerComponent>
    );
}
