import { ContainerComponent } from '@/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

export default function TermsPolicies() {
    const { t } = useTranslation();
    const navigation = useNavigation();

    return (
        <ContainerComponent iconLeft='back' title={t('terms_policies.title')} isScroll={false}>
            <WebView
                source={{ uri: 'https://www.privacypolicies.com/live/46a9c9bf-359c-4ffd-951b-3a98418291a3' }}
                style={{ flex: 1 }}
            />
        </ContainerComponent>
    );
}
