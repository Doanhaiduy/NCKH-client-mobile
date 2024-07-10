import { ButtonComponent, ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { sleep } from '@/utils';
import { LoadingModal } from '@/modals';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';

export default function verification() {
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');

    const handleVerification = async () => {
        setIsLoading(true);
        try {
            console.log('OTP: ', otp);
            await sleep(1000);
            console.log('Verified!');
            setIsLoading(false);
            router.push('/setting/change-password/set-password');
        } catch (error) {
            console.log('Can not verify! ', error);
            setIsLoading(false);
        }
    };

    return (
        <ContainerComponent isScroll iconLeft="back" title="Quên mật khẩu" search>
            <SectionComponent className="mt-2">
                <TextComponent
                    text="Chúng tôi đã gửi mã của bạn đến: mynt.63cntt@ntu.edu.vn"
                    className="font-interMd"
                />
                <SpaceComponent height={8} />
                <TextComponent text="Vui lòng kiểm tra mã trong email của bạn. Mã này gồm 6 số." />
                <TouchableOpacity className="my-4">
                    <TextComponent text="Gửi lại mã" color={colors.primary400} />
                </TouchableOpacity>
                <TextComponent text="Nhập mã gồm 6 chữ số" className="font-interMd" />
            </SectionComponent>
            <SectionComponent className="px-[56px]">
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
                <SpaceComponent height={8} />
                <ButtonComponent
                    title="Tiếp tục"
                    disabled={otp.length < 6}
                    size="large"
                    type="primary"
                    onPress={handleVerification}
                />
                <SpaceComponent height={8} />
                <ButtonComponent title="Hủy" size="large" type="outline" onPress={() => router.dismiss()} />
            </SectionComponent>
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
