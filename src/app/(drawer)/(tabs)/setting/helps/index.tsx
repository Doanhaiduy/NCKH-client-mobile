import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';

export default function HelpsPage() {
    return (
        <ContainerComponent iconLeft="back" title="Trợ giúp" search>
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
                    onPress={() => router.push('/setting/helps/faq')}
                >
                    <RowComponent className="flex-1">
                        <FontAwesome5 name="question-circle" size={24} color={colors.primary400} />
                        <TextComponent text="Câu hỏi thường gặp" className="ml-4" />
                    </RowComponent>
                    <Ionicons name="chevron-forward-outline" size={24} color={colors.text500} />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row items-center w-full py-6 border-b-[1px] border-text-700"
                    onPress={() => router.push('/setting/helps/support')}
                >
                    <RowComponent className="flex-1">
                        <FontAwesome5 name="envelope" size={24} color={colors.primary400} />
                        <TextComponent text="Hỗ trợ khách hàng" className="ml-4" />
                    </RowComponent>
                    <Ionicons name="chevron-forward-outline" size={24} color={colors.text500} />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row items-center w-full py-6 border-b-[1px] border-text-700"
                    onPress={() => router.push('/setting/helps/report-issue')}
                >
                    <RowComponent className="flex-1">
                        <FontAwesome5 name="exclamation-triangle" size={24} color={colors.primary400} />
                        <TextComponent text="Báo cáo sự cố" className="ml-4" />
                    </RowComponent>
                    <Ionicons name="chevron-forward-outline" size={24} color={colors.text500} />
                </TouchableOpacity>
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
