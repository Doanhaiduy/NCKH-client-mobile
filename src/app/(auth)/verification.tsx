import { ButtonComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import ContainerComponent from '@/components/ContainerComponent';
import { colors } from '@/constants/colors';
import { LoadingModal } from '@/modals';
import { sleep } from '@/utils';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';

export default function VerificationPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');

    const handleVerification = async () => {
        setIsLoading(true);
        try {
            console.log('OTP: ', otp);
            await sleep(1000);
            console.log('Verified!');
            setIsLoading(false);
            router.push('/set-password');
        } catch (error) {
            console.log('Can not verify! ', error);
            setIsLoading(false);
        }
    };

    return (
        <ContainerComponent isAuth isScroll iconLeft="back">
            <SpaceComponent height={120} />
            <View className="px-8 pb-4 ">
                <SectionComponent align="center">
                    <TextComponent text="Xác minh email" title className="text-primary-400" />
                    <TextComponent
                        text="Một mã OTP 6 chữ số đã được gửi đến email. Vui lòng kiểm tra và nhập mã."
                        className="text-center mt-4"
                    />
                </SectionComponent>
                <SectionComponent>
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
                    <SpaceComponent height={24} />
                    <ButtonComponent
                        title="Xác minh"
                        disabled={otp.length < 6}
                        size="large"
                        type="primary"
                        onPress={handleVerification}
                    />
                    <SpaceComponent height={24} />
                    <SectionComponent align="center" className="w-full">
                        <TextComponent text="Chưa nhận được mã OTP?" className="text-sm" />
                        <TouchableOpacity>
                            <TextComponent text="Gửi lại" className="text-sm text-primary-400" />
                        </TouchableOpacity>
                    </SectionComponent>
                    <LoadingModal visible={isLoading} />
                    <SpaceComponent height={50} />
                </SectionComponent>
            </View>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
