import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { CustomDrawerComponent } from '@/layouts/Components';

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
