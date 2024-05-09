import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';

const CustomDrawerComponent = (props: any) => {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItem
                icon={({ color, size }) => <Text>~</Text>}
                label='Home'
                onPress={() => router.push('/forgot')}
            />
        </DrawerContentScrollView>
    );
};

export default function DrawerLayout() {
    return <Drawer drawerContent={(props) => <CustomDrawerComponent {...props} />} />;
}

const styles = StyleSheet.create({});
