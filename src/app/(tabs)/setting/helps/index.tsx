import { ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function HelpsPage() {
    return (
        <ContainerComponent iconLeft="back" title="Trợ giúp" notification onBack={() => router.dismiss()}>
            <SectionComponent className="flex-1">
                <SpaceComponent height={4} />
                <TouchableOpacity
                    className="flex-row items-center w-full py-6 border-b-[1px] border-text-700"
                    onPress={() => router.push('/setting/helps/user-guide')}
                >
                    <RowComponent className="flex-1">
                        <FontAwesome5 name="book" size={24} color={colors.primary400} />
                        <TextComponent text="Hướng dẫn sử dụng" className="ml-4" />
                    </RowComponent>
                    <Ionicons name="chevron-forward-outline" size={24} color={colors.text500} />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row items-center w-full py-6 border-b-[1px] border-text-700"
                    onPress={() => router.push('/setting/helps/terms-policies')}
                >
                    <RowComponent className="flex-1">
                        <Feather name="book-open" size={24} color={colors.primary400} />
                        <TextComponent text="Điều khoản và chính sách" className="ml-4" />
                    </RowComponent>
                    <Ionicons name="chevron-forward-outline" size={24} color={colors.text500} />
                </TouchableOpacity>
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
