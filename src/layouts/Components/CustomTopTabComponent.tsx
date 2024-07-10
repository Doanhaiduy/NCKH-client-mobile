import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { RowComponent, SectionComponent, TextComponent } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import CategoriesList from './CategoriesList';

export default function CustomTopTabComponent({
    navigation,
    route,
    options,
}: {
    navigation: any;
    route: any;
    options: any;
}) {
    const heightBar: number = Platform.OS === 'ios' ? 52 : StatusBar.currentHeight || 52;

    return route.name !== 'training-point' ? (
        <View className="flex-1 bg-white">
            <LinearGradient
                start={[0.0, 0.5]}
                end={[1.0, 0.5]}
                locations={[0.0, 1.0]}
                colors={['#0500FF', '#030099']}
                style={{
                    height: Platform.OS === 'android' ? 122 : 150,
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                    paddingTop: heightBar,
                    paddingBottom: 8,
                    justifyContent: 'space-between',
                    backgroundColor: colors.white,
                }}
            >
                <StatusBar barStyle="light-content" />
                <SectionComponent>
                    <RowComponent className="justify-between w-full">
                        <TouchableOpacity>
                            <Ionicons name="logo-react" size={24} color={colors.white} />
                        </TouchableOpacity>
                        <TextComponent text="Trang chủ" title color={colors.white} />
                        <TouchableOpacity onPress={() => router.push('/search')}>
                            <Ionicons name="search" size={26} color={colors.white} />
                        </TouchableOpacity>
                    </RowComponent>
                    <View className="mt-8">
                        <CategoriesList routeName={route.name} />
                    </View>
                </SectionComponent>
            </LinearGradient>
        </View>
    ) : null;
}

const styles = StyleSheet.create({});
