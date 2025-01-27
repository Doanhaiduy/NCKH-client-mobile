import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ContainerComponent, InputComponent, SectionComponent } from '@/components';
import { authSelector } from '@/stores/reducers/authReducer';
import { useSelector } from 'react-redux';
import ImageComponent from '@/components/ImageComponent';

type Props = {};

const details = (props: Props) => {
    const { authData } = useSelector(authSelector);
    console.log('authData', authData);

    return (
        <ContainerComponent title="Chi tiết tài khoản " iconLeft="back" notification isScroll>
            <SectionComponent className="items-center flex-1 justify-center mt-4">
                <View
                    className="border-1 border border-primary-400 p-[2px]"
                    style={{
                        borderRadius: 99,
                    }}
                >
                    <ImageComponent showImageModal url={authData?.avatar!} height={80} width={80} rounded={99} />
                </View>
            </SectionComponent>
            <SectionComponent className="-mt-4">
                <View>
                    <InputComponent
                        value={authData?.username ?? 'Không có dữ liệu'}
                        onChange={() => {}}
                        labelTop="Mã số sinh viên"
                        readOnly
                    />
                    <InputComponent
                        value={authData?.fullName ?? 'Không có dữ liệu'}
                        onChange={() => {}}
                        labelTop="Họ và tên sinh viên"
                        readOnly
                    />
                    <InputComponent
                        value={authData?.email ?? 'Không có dữ liệu'}
                        onChange={() => {}}
                        labelTop="Email"
                        readOnly
                    />
                    <InputComponent
                        value={authData?.sclassName ?? 'Không có dữ liệu'}
                        onChange={() => {}}
                        labelTop="Lớp"
                        readOnly
                    />
                    <InputComponent value={'Công nghệ thông tin'} onChange={() => {}} labelTop="Khoa" readOnly />
                    <InputComponent
                        value={authData?.role ?? 'Không có dữ liệu'}
                        onChange={() => {}}
                        labelTop="Chức vụ"
                        readOnly
                    />
                </View>
            </SectionComponent>
        </ContainerComponent>
    );
};

export default details;

const styles = StyleSheet.create({});
