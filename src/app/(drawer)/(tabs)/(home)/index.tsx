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
        <ContainerComponent search isScroll title='Trang chủ' iconLeft='menu'>
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
                                    title: 'Khảo sát về việc tham gia cổ vũ chung kết giải đấu trường chân lý IT Champion Cup...',
                                    time: '2021-10-10',
                                    image: 'https://s3-alpha-sig.figma.com/img/a416/1a53/b2845c28e8feeb8d07b660fd43e611d2?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FRrW8xkVxq3hWq1M7zrdD~0fIdTqxsAs5GfheZxtxOLupZQDdxtX~VCaaiJ5Qc0dm0C8xWRxJOar-1vjSKumDxMM7ZMl~dS0J8pwv6xsMW3AL7iJAHLOy782q6g-mILuPU-WSSqGGI04j8nv5wslezhTbIS8lULMY1WfP49FV7hh67Vk8tfyACOzzAE9yPMxFlJ9FtC-z0HsdIfq4iv0QjB3koMOAs9tNnmyTzxbbf-AW~l-rVZ5GSMqvH7rEGVUhO1FuA9lFQo6TNKCkmlM0sxPEvlIwOJwjXsRiDEXrN-HHxD~5P0sF2GVDRUJdgGAck4ep~YQH4PZoHVcFiNmxA__',
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
                                    title: 'Khảo sát về việc tham gia cổ vũ chung kết giải đấu trường chân lý IT Champion Cup...',
                                    time: '2021-10-10',
                                    image: 'https://s3-alpha-sig.figma.com/img/a416/1a53/b2845c28e8feeb8d07b660fd43e611d2?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FRrW8xkVxq3hWq1M7zrdD~0fIdTqxsAs5GfheZxtxOLupZQDdxtX~VCaaiJ5Qc0dm0C8xWRxJOar-1vjSKumDxMM7ZMl~dS0J8pwv6xsMW3AL7iJAHLOy782q6g-mILuPU-WSSqGGI04j8nv5wslezhTbIS8lULMY1WfP49FV7hh67Vk8tfyACOzzAE9yPMxFlJ9FtC-z0HsdIfq4iv0QjB3koMOAs9tNnmyTzxbbf-AW~l-rVZ5GSMqvH7rEGVUhO1FuA9lFQo6TNKCkmlM0sxPEvlIwOJwjXsRiDEXrN-HHxD~5P0sF2GVDRUJdgGAck4ep~YQH4PZoHVcFiNmxA__',
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
