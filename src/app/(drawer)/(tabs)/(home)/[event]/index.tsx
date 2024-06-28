import { ContainerComponent, ItemCardList, SectionComponent, TextComponent } from '@/components';
import { FeaturedActivityData } from '@/mockData';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export default function EventList() {
    const { event, typeName } = useLocalSearchParams();

    return (
        <ContainerComponent iconLeft="back" search title={typeName?.toString()}>
            <SectionComponent className="flex-1">
                <TextComponent text={typeName?.toString() || ''} className="text-[20px] text-primary-400 mt-2 mb-4" />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={FeaturedActivityData}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={item}
                                onPress={() => {
                                    router.push({
                                        pathname: `/${typeName}/details/${item.id}`,
                                        params: {
                                            eventName: 'Hoạt động ngoại khóa',
                                        },
                                    });
                                }}
                            />
                        )}
                    />
                </View>
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
