import userAPI from '@/apis/userApi';
import { ContainerComponent, LanguageCard, SectionComponent, TextComponent } from '@/components';
import { LanguageData } from '@/mockData';
import { LoadingModal } from '@/modals';
import { LanguageCode } from '@/utils/i18n';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

export default function Language() {
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState(i18n.language as LanguageCode);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLang(i18n.language as LanguageCode);
    }, [i18n.language]);

    const changeLanguage = async (lng: LanguageCode) => {
        setLoading(true);
        try {
            await userAPI.updateLanguage({ language: lng });
            i18n.changeLanguage(lng);
            setLang(lng);
            setLoading(false);
            Alert.alert(t('language.notification_title'), t('language.language_changed_message'), [
                {
                    text: t('language.ok'),
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            setLoading(false);
            Alert.alert(t('language.error_title'), t('language.error_message'), [
                {
                    text: t('language.ok'),
                },
            ]);
        }
    };

    return (
        <ContainerComponent iconLeft='back' title={t('language.test2')} notification>
            <TextComponent text={t('language.test')} size={16} className='my-4 ml-4' />
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

            {loading && <LoadingModal />}
        </ContainerComponent>
    );
}
