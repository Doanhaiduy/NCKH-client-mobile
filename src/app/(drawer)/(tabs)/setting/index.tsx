import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ContainerComponent, SectionComponent, TextComponent } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

export default function SettingPage() {
    return (
        <ContainerComponent
            isScroll
            title='Trang chủ'
            iconLeft='menu'
            iconRight={<Ionicons name='search' size={24} color={colors['primary-400']} />}
        >
            <SectionComponent>
                <TextComponent text='Hoạt động nổi bật' className='text-[20px] text-primary-400 mt-2 mb-4' />
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
