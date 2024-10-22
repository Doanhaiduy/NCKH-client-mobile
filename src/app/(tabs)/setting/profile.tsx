import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ContainerComponent, InputComponent, SectionComponent } from '@/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { authSelector } from '@/stores/reducers/authReducer';
import { useSelector } from 'react-redux';
import ImageComponent from '@/components/ImageComponent';

type Props = {};

const details = (props: Props) => {
    const { authData } = useSelector(authSelector);

    return (
        <ContainerComponent title="Chi tiết tài khoản " iconLeft="back" notification isScroll>
            <SectionComponent className="items-center justify-center my-4">
                <View
                    className="border-1 border border-primary-400 p-[2px]"
                    style={{
                        borderRadius: 99,
                    }}
                >
                    <ImageComponent url={authData?.avatar!} height={80} width={80} rounded={9999} />
                </View>
            </SectionComponent>
            <SectionComponent>
                <View>
                    <InputComponent
                        value={authData?.username ?? ''}
                        onChange={() => {}}
                        labelTop="Mã số sinh viên"
                        readOnly
                    />
                    <InputComponent
                        value={authData?.fullName ?? ''}
                        onChange={() => {}}
                        labelTop="Họ và tên sinh viên"
                        readOnly
                    />
                    <InputComponent value={authData?.email ?? ''} onChange={() => {}} labelTop="Email" readOnly />
                    <InputComponent value={authData?.sclassName ?? ''} onChange={() => {}} labelTop="Lớp" readOnly />
                    <InputComponent value={'Công nghệ thông tin'} onChange={() => {}} labelTop="Khoa" readOnly />
                    <InputComponent value={'Thành viên'} onChange={() => {}} labelTop="Chức vụ" readOnly />
                </View>
            </SectionComponent>
        </ContainerComponent>
    );
};

export default details;

const styles = StyleSheet.create({});
