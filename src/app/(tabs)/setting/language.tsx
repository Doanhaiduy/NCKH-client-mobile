import { ContainerComponent, LanguageCard, SectionComponent, TextComponent } from '@/components';
import { LanguageData } from '@/mockData';
import { LanguageCode } from '@/utils/i18n';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet } from 'react-native';

export default function Language() {
    const [lang, setLang] = useState('vi');

    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: LanguageCode) => {
        i18n.changeLanguage(lng);
        setLang(lng);
        router.back();

        Alert.alert('Thông báo', 'Ngôn ngữ đã được thay đổi', [
            {
                text: 'OK',
                onPress: () => {},
            },
        ]);
    };

    return (
        <ContainerComponent iconLeft='back' title={t('common.test2')} notification>
            <TextComponent text={t('common.test')} size={16} className='my-4 ml-4' />
            <SectionComponent>
                {LanguageData.map((item, index) => (
                    <LanguageCard
                        lang={item.lang}
                        key={index}
                        text={item.name}
                        icon={item.icon}
                        active={item.lang === lang}
                        onPress={(val: string) => {
                            changeLanguage(val as LanguageCode);
                        }}
                    />
                ))}
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
