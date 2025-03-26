import { ActionListComponents, ContainerComponent, SectionComponent, TextComponent } from '@/components';
import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function UserGuide() {
    const { t } = useTranslation();

    return (
        <ContainerComponent iconLeft='back' title={t('user_guide.title')} notification>
            <SectionComponent className='flex-1' title={t('user_guide.help_question')} titleCenter>
                <ScrollView>
                    <ActionListComponents full isHelper />
                </ScrollView>
            </SectionComponent>
        </ContainerComponent>
    );
}
