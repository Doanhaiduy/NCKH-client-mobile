import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, router } from 'expo-router';
import {
    ButtonComponent,
    CardComponent,
    ContainerComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import ItemCardList from '@/components/ItemCardList';
import { FlatList } from 'react-native-gesture-handler';

export default function Attendance() {
    return (
        <ContainerComponent iconLeft="menu" title="Điểm danh" isScroll search>
            <SectionComponent className="">
                <TextComponent text="Hoạt động đang diễn ra" className="text-[20px] text-primary-400 mt-2 mb-4" />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={[1, 2, 3]}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={{
                                    title: 'Khảo sát về việc tham gia cổ vũ chung kết giải đấu trường chân lý IT Champion Cup...',
                                    time: '2024-10-10',
                                    image: 'https://s3-alpha-sig.figma.com/img/a416/1a53/b2845c28e8feeb8d07b660fd43e611d2?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FRrW8xkVxq3hWq1M7zrdD~0fIdTqxsAs5GfheZxtxOLupZQDdxtX~VCaaiJ5Qc0dm0C8xWRxJOar-1vjSKumDxMM7ZMl~dS0J8pwv6xsMW3AL7iJAHLOy782q6g-mILuPU-WSSqGGI04j8nv5wslezhTbIS8lULMY1WfP49FV7hh67Vk8tfyACOzzAE9yPMxFlJ9FtC-z0HsdIfq4iv0QjB3koMOAs9tNnmyTzxbbf-AW~l-rVZ5GSMqvH7rEGVUhO1FuA9lFQo6TNKCkmlM0sxPEvlIwOJwjXsRiDEXrN-HHxD~5P0sF2GVDRUJdgGAck4ep~YQH4PZoHVcFiNmxA__',
                                }}
                                onPress={() => {}}
                                onPressButton={() => {
                                    router.push({
                                        pathname: '/(drawer)/(tabs)/attendance/1',
                                        params: {
                                            eventName:
                                                'Khảo sát về việc tham gia cổ vũ chung kết giải đấu trường chân lý IT Champion Cup...',
                                        },
                                    });
                                }}
                                isAction
                            />
                        )}
                    />
                </View>
            </SectionComponent>
            <SectionComponent className="border-t-[1px] border-text-500">
                <TextComponent text="Hoạt động đã diễn ra" className="text-[20px] text-primary-400 mt-2 mb-4" />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={[1, 2]}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={{
                                    title: 'Khảo sát về việc tham gia cổ vũ chung kết giải đấu trường chân lý IT Champion Cup...',
                                    time: '2024-10-10',
                                    image: 'https://s3-alpha-sig.figma.com/img/a416/1a53/b2845c28e8feeb8d07b660fd43e611d2?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FRrW8xkVxq3hWq1M7zrdD~0fIdTqxsAs5GfheZxtxOLupZQDdxtX~VCaaiJ5Qc0dm0C8xWRxJOar-1vjSKumDxMM7ZMl~dS0J8pwv6xsMW3AL7iJAHLOy782q6g-mILuPU-WSSqGGI04j8nv5wslezhTbIS8lULMY1WfP49FV7hh67Vk8tfyACOzzAE9yPMxFlJ9FtC-z0HsdIfq4iv0QjB3koMOAs9tNnmyTzxbbf-AW~l-rVZ5GSMqvH7rEGVUhO1FuA9lFQo6TNKCkmlM0sxPEvlIwOJwjXsRiDEXrN-HHxD~5P0sF2GVDRUJdgGAck4ep~YQH4PZoHVcFiNmxA__',
                                }}
                                onPressButton={() => {
                                    router.push({
                                        pathname: '/(drawer)/(tabs)/attendance/1',
                                        params: {
                                            eventName:
                                                'Khảo sát về việc tham gia cổ vũ chung kết giải đấu trường chân lý IT Champion Cup...',
                                        },
                                    });
                                }}
                            />
                        )}
                    />
                </View>
            </SectionComponent>
            <View className=" w-[80%] mx-auto">
                <ButtonComponent
                    title="Xem hoạt động đã điểm danh"
                    size="large"
                    type="primary"
                    onPress={() => {
                        router.push('/attendance/list');
                    }}
                />
            </View>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
