import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { TextComponent } from '@/components';
import { RoutesCategories } from '@/constants/routes';
import { ScrollView } from 'react-native-gesture-handler';
import { sleep } from '@/utils';

interface Props {
    routeName?: string;
    index?: number;
    onPress?: () => void;
}

export default function CategoriesList(props: Props) {
    const { routeName, index } = props;

    const flatListRef = useRef<FlatList | null>(null);
    const activeIndex = index || 0;
    console.log('activeIndex', activeIndex);
    useEffect(() => {
        flatListRef.current?.scrollToIndex({ index: activeIndex, animated: true });
    }, [index]);
    return (
        <ScrollView
            horizontal
            style={{ paddingHorizontal: 16, flex: 1, maxHeight: 40 }}
            showsHorizontalScrollIndicator={false}
        >
            {RoutesCategories.map((item, index) => (
                <TouchableOpacity
                    onPress={() => {
                        router.navigate({
                            pathname: item.route,
                            params: {
                                typeName: item.name,
                            },
                        });
                    }}
                    style={{
                        marginRight: index === RoutesCategories.length - 1 ? 30 : 20,
                        minWidth: 53,
                    }}
                    key={index}
                >
                    <TextComponent text={item.name} color={routeName === item.name ? '#FFD000' : colors.white} />
                    <View
                        style={{
                            width: '100%',
                            height: 4,
                            borderRadius: 5,
                            backgroundColor:
                                routeName === 'index' && item.name === 'Tất cả'
                                    ? '#FFD000'
                                    : routeName === item.route.split('/')[1]
                                      ? '#FFD000'
                                      : 'transparent',
                            marginTop: 6,
                        }}
                    />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({});
