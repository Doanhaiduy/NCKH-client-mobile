import { View } from 'react-native';
import React from 'react';
import { ContainerComponent, InputComponent, SectionComponent } from '@/components';
import { authSelector } from '@/stores/reducers/authReducer';
import { useSelector } from 'react-redux';
import ImageComponent from '@/components/ImageComponent';
import { useTranslation } from 'react-i18next';

type Props = {};

const Details = (props: Props) => {
    const { t } = useTranslation();
    const { authData } = useSelector(authSelector);

    return (
        <ContainerComponent title={t('profile.title')} iconLeft='back' notification isScroll>
            <SectionComponent className='items-center flex-1 justify-center mt-4'>
                <View
                    className='border-1 border border-primary-400 p-[2px]'
                    style={{
                        borderRadius: 99,
                    }}
                >
                    <ImageComponent showImageModal url={authData?.avatar!} height={80} width={80} rounded={99} />
                </View>
            </SectionComponent>
            <SectionComponent className='-mt-4'>
                <View>
                    <InputComponent
                        value={authData?.username ?? t('profile.no_data')}
                        onChange={() => {}}
                        labelTop={t('profile.student_id_label')}
                        readOnly
                    />
                    <InputComponent
                        value={authData?.fullName ?? t('profile.no_data')}
                        onChange={() => {}}
                        labelTop={t('profile.full_name_label')}
                        readOnly
                    />
                    <InputComponent
                        value={authData?.email ?? t('profile.no_data')}
                        onChange={() => {}}
                        labelTop={t('profile.email_label')}
                        readOnly
                    />
                    <InputComponent
                        value={authData?.sclassName ?? t('profile.no_data')}
                        onChange={() => {}}
                        labelTop={t('profile.class_label')}
                        readOnly
                    />
                    <InputComponent
                        value={'Công nghệ thông tin'} // Giữ nguyên vì đây là giá trị cố định
                        onChange={() => {}}
                        labelTop={t('profile.faculty_label')}
                        readOnly
                    />
                    <InputComponent
                        value={authData?.role ?? t('profile.no_data')}
                        onChange={() => {}}
                        labelTop={t('profile.role_label')}
                        readOnly
                    />
                </View>
            </SectionComponent>
        </ContainerComponent>
    );
};

export default Details;
