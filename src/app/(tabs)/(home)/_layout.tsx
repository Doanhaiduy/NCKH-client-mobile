import { CustomTopTabComponent } from '@/layouts/Components';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function HomeLayout() {
    return (
        <Tabs
            screenOptions={{
                header: (props) => <CustomTopTabComponent {...props} />,
                headerStyle: {
                    backgroundColor: '#fff',
                },
            }}
            tabBar={() => null}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerBackgroundContainerStyle: {
                        backgroundColor: '#fff',
                    },
                }}
            />
        </Tabs>
    );
}
