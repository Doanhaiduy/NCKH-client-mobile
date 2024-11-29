import { ActionListComponents, ContainerComponent, SectionComponent, TextComponent } from '@/components';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function UserGuide() {
    return (
        <ContainerComponent iconLeft="back" title="Hướng dẫn sử dụng" notification>
            <SectionComponent className="flex-1" title="Chúng tôi có thể giúp gì cho bạn?" titleCenter>
                <ScrollView>
                    <ActionListComponents full isHelper />
                </ScrollView>
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
