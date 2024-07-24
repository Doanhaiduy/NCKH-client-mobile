import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { RowComponent, SectionComponent, TextComponent } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import CategoriesList from './CategoriesList';
import Animated, { SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useHeaderHeight } from '@/contexts/HeaderHeightContext';
import { appInfo } from '@/constants/appInfo';

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
    const { headerHeight } = useHeaderHeight();
    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(headerHeight),
        };
    });

    const animatedCategoriesListStyle = useAnimatedStyle(() => {
        return {
            display: headerHeight === appInfo.headerHeight.onScroll ? 'none' : 'flex',
        };
    });

    return route.name !== 'training-point' ? (
        <View className="bg-white ">
            <Animated.View style={[animatedContainerStyle]}>
                <LinearGradient
                    start={[0.0, 0.5]}
                    end={[1.0, 0.5]}
                    locations={[0.0, 1.0]}
                    colors={['#0500FF', '#030099']}
                    style={{
                        flex: 1,
                        // borderBottomLeftRadius: headerHeight === appInfo.headerHeight.onScroll ? 0 : 30,
                        // borderBottomRightRadius: headerHeight === appInfo.headerHeight.onScroll ? 0 : 30,
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                        paddingTop: heightBar,
                        paddingBottom: 0,
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
                        <Animated.View className="mt-8" style={animatedCategoriesListStyle}>
                            <CategoriesList routeName={route.name} index={route.params.index} />
                        </Animated.View>
                    </SectionComponent>
                </LinearGradient>
            </Animated.View>
        </View>
    ) : null;
}

const styles = StyleSheet.create({});
