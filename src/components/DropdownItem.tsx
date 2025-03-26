import { colors } from '@/constants/colors';
import { RoutesDrawerDropDown } from '@/constants/routes';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import TextComponent from './TextComponent';
import { useTranslation } from 'react-i18next';

export default function DropdownItem() {
    const { t } = useTranslation();

    return (
        <View className='px-4'>
            <View className='flex-row items-center gap-2'>
                <AntDesign name='solution1' size={24} color='black' />
                <TextComponent className='text-base' text={t('dropdown_item_component.extracurricular_activities')} />
            </View>
            <View className='pl-3 mt-2 w-[600px]'>
                {RoutesDrawerDropDown.map((item, index) => (
                    <DrawerItem
                        labelStyle={{
                            width: 600,
                            marginLeft: -20,
                            fontSize: 16,
                            fontWeight: 'normal',
                            fontFamily: 'Inter',
                        }}
                        key={index}
                        icon={({ color, size }) => <Ionicons name='chevron-forward' color={colors.text200} />}
                        label={item.name}
                        onPress={() =>
                            router.push({
                                pathname: item.route,
                                params: {
                                    typeName: item.name,
                                },
                            })
                        }
                    />
                ))}
            </View>
        </View>
    );
}
