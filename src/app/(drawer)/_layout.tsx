import { CustomDrawerComponent } from '@/layouts/Components';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function DrawerLayout() {
    return (
        <Drawer
            screenOptions={{
                headerShown: false,
            }}
            drawerContent={(props) => <CustomDrawerComponent {...props} />}
        />
    );
}

const styles = StyleSheet.create({});
