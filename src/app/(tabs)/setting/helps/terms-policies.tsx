import { ContainerComponent, SectionComponent, TextComponent } from '@/components';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TermsPolicies() {
    const { t } = useTranslation();

    return (
        <ContainerComponent isScroll iconLeft='back' title={t('terms_policies.title')} notification>
            <SectionComponent title={t('terms_policies.terms_of_use')}>
                <TextComponent
                    text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula, leo non ornare
                    suscipit, mauris nibh egestas dui, placerat tristique nisl risus et augue. Nulla facilisi. Sed nec
                    mi nec sapi en. Nullam in nunc nec purus ultrices lacinia. Nulla facilisi. Sed nec mi nec sapien.
                    Nullam in nunc nec purus ultrices lacinia.'
                />
                <TextComponent
                    text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula, leo non ornare
                    suscipit, mauris nibh egestas dui, placerat tristique nisl risus et augue. Nulla facilisi. Sed nec
                    mi nec sapi en. Nullam in nunc nec purus ultrices lacinia. Nulla facilisi. Sed nec mi nec sapien.
                    Nullam in nunc nec purus ultrices lacinia.'
                />
            </SectionComponent>
            <SectionComponent title={t('terms_policies.privacy_policy')}>
                <TextComponent
                    text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula, leo non ornare
                    suscipit, mauris nibh egestas dui, placerat tristique nisl risus et augue. Nulla facilisi. Sed nec
                    mi nec sapi en. Nullam in nunc nec purus ultrices lacinia. Nulla facilisi. Sed nec mi nec sapien.
                    Nullam in nunc nec purus ultrices lacinia.'
                />
                <TextComponent
                    text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vehicula, leo non ornare
                    suscipit, mauris nibh egestas dui, placerat tristique nisl risus et augue. Nulla facilisi. Sed nec
                    mi nec sapi en. Nullam in nunc nec purus ultrices lacinia. Nulla facilisi. Sed nec mi nec sapien.
                    Nullam in nunc nec purus ultrices lacinia.'
                />
            </SectionComponent>
        </ContainerComponent>
    );
}
