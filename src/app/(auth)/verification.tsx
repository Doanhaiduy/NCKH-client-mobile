import authAPI from '@/apis/authApi';
import { ButtonComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import ContainerComponent from '@/components/ContainerComponent';
import { colors } from '@/constants/colors';
import { LoadingModal } from '@/modals';
import { authSelector, setDoneVerify, setOtpValue } from '@/stores/reducers/authReducer';
import { obfuscateEmail, sleep } from '@/utils';
import { checkExpiredTime, getSecondTimeLimit } from '@/utils/dateTime';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';
import { useDispatch, useSelector } from 'react-redux';

export default function VerificationPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [expiredTime, setExpiredTime] = useState(0);
    const { OTP } = useSelector(authSelector);
    const otpRef = React.useRef<OtpInputRef>(null);
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
        console.log('inputOtp', inputOtp);

        if (inputOtp.length !== 6) {
            setError('Mã OTP không hợp lệ');
            setIsLoading(false);
            return;
        }

        if (inputOtp == OTP?.otp) {
            if (checkExpiredTime(OTP?.expiredIn || 0)) {
                setError('Mã OTP đã hết hạn');
            } else {
                await sleep(500);
                dispatch(setDoneVerify());
                router.push('/set-password');
                setError('');
            }
        } else {
            setError('Mã OTP không chính xác');
        }

        setIsLoading(false);
    };

    const { mutate, isPending } = useMutation({
        mutationFn: (variables: { email: string }) => authAPI.sendOTP(variables),
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
        <ContainerComponent isAuth isScroll iconLeft="back">
            <SpaceComponent height={120} />
            <View className="px-8 pb-4 ">
                <SectionComponent align="center">
                    <TextComponent text="Xác minh email" title className="text-primary-400" />
                    <TextComponent
                        text={`Một mã OTP 6 chữ số đã được gửi đến email ${obfuscateEmail(OTP?.email || '')}.`}
                        className="text-center mt-4"
                    />
                    <TextComponent text="Vui lòng kiểm tra và nhập mã." className="text-center" />
                </SectionComponent>
                <SectionComponent className="items-center">
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
                        title="Xác minh"
                        disabled={otp.length < 6}
                        size="large"
                        type="primary"
                        onPress={() => handleVerification(undefined)}
                    />

                    <SpaceComponent height={12} />

                    {expiredTime > 0 ? (
                        <TextComponent
                            text={`Mã xác minh sẽ hết hạn trong ${expiredTime} giây`}
                            size={11}
                            color={colors.error}
                        />
                    ) : (
                        <SectionComponent align="center" className="w-full">
                            <TextComponent text="Chưa nhận được mã OTP?" className="text-sm" />
                            <TouchableOpacity onPress={handleResendOTP}>
                                <TextComponent text="Gửi lại" className="text-sm text-primary-400" />
                            </TouchableOpacity>
                        </SectionComponent>
                    )}

                    <SpaceComponent height={12} />

                    <LoadingModal visible={isPending || isLoading} />
                    <SpaceComponent height={50} />
                </SectionComponent>
            </View>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
