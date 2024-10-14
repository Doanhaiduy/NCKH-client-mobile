import { ContainerComponent, LanguageCard, SectionComponent, TextComponent } from '@/components';
import { LanguageData } from '@/mockData';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

export default function Language() {
    const [lang, setLang] = useState('vi');

    return (
        <ContainerComponent iconLeft="back" title="Ngôn ngữ" notification>
            <TextComponent text="Chọn ngôn ngữ của bạn:" size={16} className="my-4 ml-4" />
            <SectionComponent>
                {LanguageData.map((item, index) => (
                    <LanguageCard
                        lang={item.lang}
                        key={index}
                        text={item.name}
                        icon={item.icon}
                        active={item.lang === lang}
                        onPress={(val: string) => {
                            setLang(val);
                            Alert.alert('Đổi ngôn ngữ', `Đổi ngôn ngữ thành công - ${item.name}`, [
                                {
                                    text: 'Ok',
                                    onPress: () => {
                                        router.back();
                                    },
                                },
                            ]);
                        }}
                    />
                ))}
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
