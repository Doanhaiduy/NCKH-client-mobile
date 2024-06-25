import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ButtonComponent, ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';

export default function Details() {
    const { id, eventName } = useLocalSearchParams();
    return (
        <ContainerComponent iconLeft='back' search title='Điểm Danh'>
            <SectionComponent className='items-center '>
                <TextComponent text={eventName?.toString() || ''} size={20} className='text-center mt-4' />
                <SpaceComponent height={40} />
                <Image source={require('@/assets/images/scanner.png')} className='w-[90%] h-[310px]' />
                <SpaceComponent height={40} />
            </SectionComponent>
            <SectionComponent className='items-center w-[80%] mx-auto'>
                <ButtonComponent
                    title='Điểm danh'
                    type='primary'
                    size='large'
                    onPress={() => {
                        router.push({
                            pathname: '/(drawer)/(tabs)/attendance/scan',
                            params: {
                                id: id,
                            },
                        });
                    }}
                />
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
