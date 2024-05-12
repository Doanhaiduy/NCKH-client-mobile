import {
    ButtonComponent,
    ContainerComponent,
    ItemCardGrid,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import ItemCardList from '@/components/ItemCardList';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function Home() {
    return (
        <ContainerComponent
            isScroll
            title='Trang chủ'
            iconLeft='menu'
            iconRight={<Ionicons name='search' size={24} color={colors['primary-400']} />}
        >
            <Link href={'/'}> back to root</Link>

            <SectionComponent className='border-b-[0.4px]'>
                <TextComponent text='Hoạt động nổi bật' className='text-[20px] text-primary-400 mt-2 mb-4' />
                <ItemCardGrid
                    size='large'
                    data={{
                        title: 'Event 1',
                        time: '2021-10-10',
                        description: 'Description 1',
                        image: '',
                    }}
                    onPress={() => {}}
                />
                <View className='flex-1'>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={[1, 2, 3, 4]}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        numColumns={2}
                        ListFooterComponent={() => (
                            <View className='items-center'>
                                <SpaceComponent height={16} />
                                <ButtonComponent title='Xem thêm' size='small' type='primary' onPress={() => {}} />
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <ItemCardGrid
                                size='medium'
                                data={{
                                    title: 'Event 1',
                                    time: '2021-10-10',
                                    description: 'Description 1',
                                    image: '',
                                }}
                                onPress={() => {}}
                            />
                        )}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className=''>
                <TextComponent text='Tin tức' className='text-[20px] text-primary-400 mt-2 mb-4' />
                <View className='flex-1'>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={[1, 2, 3, 4]}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        ListFooterComponent={() => (
                            <View className='items-center'>
                                <SpaceComponent height={16} />
                                <ButtonComponent title='Xem thêm' size='small' type='primary' onPress={() => {}} />
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={{
                                    title: 'Event 1',
                                    time: '2021-10-10',
                                    image: '',
                                }}
                                onPress={() => {}}
                            />
                        )}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className='border-b-[0.4px]'>
                <TextComponent text='Hoạt động đang diễn ra' className='text-[20px] text-primary-400 mt-2 mb-4' />
                <ItemCardGrid
                    size='large'
                    data={{
                        title: 'Event 1',
                        time: '2021-10-10',
                        description: 'Description 1',
                        image: '',
                    }}
                    onPress={() => {}}
                />
                <View className='flex-1'>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={[1, 2, 3, 4]}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        numColumns={2}
                        ListFooterComponent={() => (
                            <View className='items-center'>
                                <SpaceComponent height={16} />
                                <ButtonComponent title='Xem thêm' size='small' type='primary' onPress={() => {}} />
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <ItemCardGrid
                                size='medium'
                                data={{
                                    title: 'Event 1',
                                    time: '2021-10-10',
                                    description: 'Description 1',
                                    image: '',
                                }}
                                onPress={() => {}}
                            />
                        )}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className=''>
                <TextComponent text='Hoạt động đã diễn ra' className='text-[20px] text-primary-400 mt-2 mb-4' />
                <View className='flex-1'>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={[1, 2, 3, 4]}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        ListFooterComponent={() => (
                            <View className='items-center'>
                                <SpaceComponent height={16} />
                                <ButtonComponent title='Xem thêm' size='small' type='primary' onPress={() => {}} />
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={{
                                    title: 'Event 1',
                                    time: '2021-10-10',
                                    image: '',
                                }}
                                onPress={() => {}}
                            />
                        )}
                    />
                </View>
            </SectionComponent>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
