import { ButtonComponent, ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { obfuscateEmail, sleep } from '@/utils';
import { LoadingModal } from '@/modals';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';
import { useDispatch, useSelector } from 'react-redux';
import { checkExpiredTime, getSecondTimeLimit } from '@/utils/dateTime';
import { authSelector, removeOTP, setDoneVerify, setOtpValue } from '@/stores/reducers/authReducer';
import { useMutation } from '@tanstack/react-query';
import authAPI from '@/apis/authApi';
import { useTranslation } from 'react-i18next';

export default function Verification() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [expiredTime, setExpiredTime] = useState(0);
    const [error, setError] = useState('');
    const otpRef = React.useRef<OtpInputRef>(null);
    const { OTP } = useSelector(authSelector);

    const dispatch = useDispatch<any>();

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
            setError(t('verification_v2.invalid_otp'));
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
            dispatch(
                setDoneVerify({
                    resetToken: data.resetToken,
                }),
            );
            router.push('/setting/change-password/set-password');
            setError('');
            otpRef.current?.clear();
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
        <ContainerComponent isScroll iconLeft='back' title={t('verification_v2.title')} notification>
            <SectionComponent className='mt-2'>
                <TextComponent
                    text={t('verification_v2.sent_otp_message').replace('{email}', obfuscateEmail(OTP?.email || ''))}
                    className='font-interMd'
                />
                <SpaceComponent height={8} />
                <TextComponent className='text-md' text={t('verification_v2.check_otp_instruction')} />
                {expiredTime > 0 ? (
                    <TextComponent
                        text={t('verification_v2.otp_expiry_message').replace('{seconds}', expiredTime.toString())}
                        size={11}
                        color={colors.error}
                    />
                ) : (
                    <View className='w-full flex gap-1 flex-row'>
                        <TextComponent text={t('verification_v2.no_otp_message')} className='text-md' />
                        <TouchableOpacity onPress={handleResendOTP}>
                            <TextComponent
                                text={t('verification_v2.resend_otp')}
                                className='text-md text-primary-500'
                            />
                        </TouchableOpacity>
                    </View>
                )}
                <TextComponent text={t('verification_v2.enter_otp_instruction')} className='font-interMd text-md' />
            </SectionComponent>
            <SectionComponent className='px-[56px]'>
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
                <SpaceComponent height={8} />
                {error ? <TextComponent text={error} size={11} color={colors.error} /> : null}
                <ButtonComponent
                    title={t('verification_v2.verify_button')}
                    disabled={otp.length < 6}
                    size='large'
                    type='primary'
                    onPress={() => handleVerification(undefined)}
                />
                <SpaceComponent height={8} />
                <ButtonComponent
                    title={t('verification_v2.cancel_button')}
                    size='large'
                    type='outline'
                    onPress={() => {
                        dispatch(removeOTP());
                        router.back();
                    }}
                />
            </SectionComponent>
            {isPending || isLoading || isVerifying ? <LoadingModal /> : null}
        </ContainerComponent>
    );
}
