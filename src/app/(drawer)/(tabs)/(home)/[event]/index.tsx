import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ButtonComponent, ContainerComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import ItemCardList from '@/components/ItemCardList';

export default function EventList() {
    const { event, typeName } = useLocalSearchParams();
    console.log({ event });
    return (
        <ContainerComponent iconLeft="back" search title={typeName?.toString()}>
            <SectionComponent className="flex-1">
                <TextComponent text="Tin tức" className="text-[20px] text-primary-400 mt-2 mb-4" />
                <View className="flex-1">
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={[1, 2, 3, 4]}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        // ListFooterComponent={() => (
                        //     <View className='items-center'>
                        //         <SpaceComponent height={16} />
                        //         <ButtonComponent title='Xem thêm' size='small' type='primary' onPress={() => {}} />
                        //     </View>
                        // )}
                        renderItem={({ item }) => (
                            <ItemCardList
                                data={{
                                    title: 'Lịch thi đấu chính thức giải bóng chuyền nam - nữ sinh viên NTU 2024',
                                    time: '2021-10-10',
                                    image: '',
                                }}
                                onPress={() => {
                                    router.push({
                                        pathname: `/${typeName}/details/1`,
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
