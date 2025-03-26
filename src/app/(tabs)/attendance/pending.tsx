import { ButtonComponent, ContainerComponent, SectionComponent } from '@/components';
import React from 'react';

export default function Pending() {
    return (
        <ContainerComponent iconLeft='logo' title='Pending' isScroll>
            <SectionComponent>
                <ButtonComponent title='Xác nhận điểm danh' type='primary' size='large' onPress={() => {}} />
            </SectionComponent>
        </ContainerComponent>
    );
}
