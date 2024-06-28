import {
    ButtonComponent,
    ContainerComponent,
    InputComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { LoadingModal } from '@/modals';
import { Regex, sleep } from '@/utils';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ForGotPassWord() {
    const [email, setEmail] = useState('haiduy@gmai.com');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleCheckEmail = () => {
        const isValidEmail = Regex.email.test(email);
        setIsError(!isValidEmail);
    };

    const handleSendOTP = async () => {
        setIsLoading(true);
        try {
            await sleep(1000);
            console.log('Send OTP to email: ', email);
            setIsLoading(false);
            router.push('/verification');
        } catch (error) {
            console.log('Can not send email! ', error);
            setIsLoading(false);
        }
    };

    return (
        <ContainerComponent isAuth isScroll iconLeft="back">
            <SpaceComponent height={120} />
            <View className="px-8 pb-4">
                <SectionComponent align="center">
                    <TextComponent text="Quên mật khẩu?" title className="text-primary-400" />
                    <TextComponent
                        text="Vui lòng nhập địa chỉ email đã liên kết với tài khoản của bạn."
                        className="text-center mt-4"
                    />
                    <TextComponent text="Chúng tôi sẽ gửi một mã OTP." className="text-center" />
                </SectionComponent>
                <SectionComponent>
                    <SpaceComponent height={24} />
                    <InputComponent
                        placeholder="Email"
                        onEnd={handleCheckEmail}
                        value={email}
                        err={!isError ? undefined : 'Invalid email'}
                        onChange={(val) => setEmail(val)}
                    />
                    <SpaceComponent height={24} />
                    <ButtonComponent
                        title="Gửi mã OTP"
                        size="large"
                        type="primary"
                        disabled={isError || !email}
                        onPress={handleSendOTP}
                    />
                    <View className="flex-row justify-center items-center gap-1 my-4">
                        <View className="flex-1 h-[0.5px] bg-black" />
                        <TextComponent text="Hoặc" />
                        <View className="flex-1 h-[0.5px] bg-black" />
                    </View>
                    <ButtonComponent
                        title="Đăng nhập"
                        size="large"
                        type="outline"
                        onPress={() => router.dismissAll()}
                    />
                </SectionComponent>
            </View>
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
