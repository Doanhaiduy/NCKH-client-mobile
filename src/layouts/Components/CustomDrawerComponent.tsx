import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { DropdownItem, SectionComponent, SpaceComponent } from '@/components';
import { colors } from '@/constants/colors';
import { Entypo, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';

export default function CustomDrawerComponent(props: any) {
    return (
        <DrawerContentScrollView
            scrollEnabled={false}
            contentContainerStyle={{
                backgroundColor: colors.primary600,
                flex: 1,
            }}
        >
            <SectionComponent className="bg-primary-800">
                <SpaceComponent height={20} />
                <Text className="text-xl text-center font-interMd text-white">Information Technology</Text>
            </SectionComponent>
            <ScrollView className="bg-white flex-1 py-3 min-w-[600px] ">
                <DropdownItem />
                <DrawerItem
                    style={{
                        width: '100%',
                    }}
                    labelStyle={{
                        width: 600,
                        marginLeft: -24,
                        fontSize: 16,
                        fontWeight: 'normal',
                        fontFamily: 'Inter',
                    }}
                    icon={({ color, size }) => <Ionicons name="newspaper" size={24} />}
                    label="Tin tức"
                    onPress={() => router.push('/tin-tuc')}
                />
                <DrawerItem
                    style={{
                        width: '100%',
                    }}
                    labelStyle={{
                        width: 600,
                        marginLeft: -24,
                        fontSize: 16,
                        fontWeight: 'normal',
                        fontFamily: 'Inter',
                    }}
                    icon={({ color, size }) => <FontAwesome5 name="clipboard-check" size={24} color="black" />}
                    label="Đánh giá rèn luyện"
                    onPress={() => router.push('/training-point')}
                />

                <DrawerItem
                    style={{
                        width: '100%',
                    }}
                    labelStyle={{
                        width: 600,
                        marginLeft: -24,
                        fontSize: 16,
                        fontWeight: 'normal',
                        fontFamily: 'Inter',
                    }}
                    icon={({ color, size }) => <FontAwesome5 name="clipboard-list" size={24} color="black" />}
                    label="Đã điểm danh"
                    onPress={() => router.push('/attendance/list')}
                />
                <DrawerItem
                    style={{
                        width: '100%',
                    }}
                    labelStyle={{
                        width: 600,
                        marginLeft: -24,
                        fontSize: 16,
                        fontWeight: 'normal',
                        fontFamily: 'Inter',
                    }}
                    icon={({ color, size }) => <Entypo name="lock" size={24} color="black" />}
                    label="Đổi mật khẩu"
                    onPress={() => router.push('/setting/change-password')}
                />
                <DrawerItem
                    style={{
                        width: '100%',
                    }}
                    labelStyle={{
                        width: 600,
                        marginLeft: -24,
                        fontSize: 16,
                        fontWeight: 'normal',
                        fontFamily: 'Inter',
                    }}
                    icon={({ color, size }) => <Entypo name="message" size={24} color="black" />}
                    label="Trợ giúp"
                    onPress={() => router.push('/setting/helps')}
                />
                <DrawerItem
                    style={{
                        width: '100%',
                    }}
                    labelStyle={{
                        width: 600,
                        marginLeft: -24,
                        fontSize: 16,
                        fontWeight: 'normal',
                        fontFamily: 'Inter',
                        color: colors.error,
                    }}
                    icon={({ color, size }) => <FontAwesome name="sign-out" size={24} color="black" />}
                    label="Đăng xuất"
                    onPress={() =>
                        Alert.alert('Thông báo', 'Bạn có chắc chắn muốn đăng xuất?', [
                            {
                                text: 'Hủy',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            { text: 'Đồng ý', onPress: () => router.push('/sign-in') },
                        ])
                    }
                />
                <SpaceComponent height={70} />
            </ScrollView>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({});
