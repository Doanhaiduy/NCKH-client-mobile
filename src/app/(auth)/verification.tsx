import { ButtonComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import ContainerComponent from '@/components/ContainerComponent';
import { colors } from '@/constants/colors';
import { LoadingModal } from '@/modals';
import { sendOTP } from '@/stores/actions/authAction';
import { authSelector, setDoneVerify } from '@/stores/reducers/authReducer';
import { checkExpiredTime, getSecondTimeLimit, obfuscateEmail, sleep } from '@/utils';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { useDispatch, useSelector } from 'react-redux';

export default function VerificationPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [expiredTime, setExpiredTime] = useState(0);
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

    const handleVerification = async () => {
        console.log({
            otp,
            OTP,
        });
        setIsLoading(true);
        if (otp == OTP?.otp) {
            if (checkExpiredTime(OTP?.expiredIn || 0)) {
                setError('Mã OTP đã hết hạn');
                setIsLoading(false);
                return;
            } else {
                await sleep(500);
                dispatch(setDoneVerify());
                router.push('/set-password');
                setError('');
                setIsLoading(false);
            }
        } else {
            setError('Mã OTP không chính xác');
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        if (OTP?.email) {
            await dispatch(sendOTP({ email: OTP?.email || '' }));
        }
        setIsLoading(false);
    };

    return (
        <ContainerComponent isAuth isScroll iconLeft="back">
            <SpaceComponent height={120} />
            <View className="px-8 pb-4 ">
                <SectionComponent align="center">
                    <TextComponent text="Xác minh email" title className="text-primary-400" />
                    <TextComponent
                        text={`Một mã OTP 6 chữ số đã được gửi đến email ${obfuscateEmail(
                            OTP?.email || '',
                        )}. Vui lòng kiểm tra và nhập mã.`}
                        className="text-center mt-4"
                    />
                </SectionComponent>
                <SectionComponent className="items-center">
                    <SpaceComponent height={24} />
                    <OtpInput
                        numberOfDigits={6}
                        autoFocus
                        focusColor={colors['primary400']}
                        onTextChange={(text) => setOtp(text)}
                        theme={{
                            pinCodeContainerStyle: {
                                width: 40,
                                height: 56,
                                backgroundColor: colors['white'],
                                borderColor: colors['primary400'],
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
                        onPress={handleVerification}
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

                    <LoadingModal visible={isLoading} />
                    <SpaceComponent height={50} />
                </SectionComponent>
            </View>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
