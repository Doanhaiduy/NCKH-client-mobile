import { HeaderHeightProvider } from '@/contexts/HeaderHeightContext';
import { CustomTopTabComponent } from '@/layouts/Components';
import { Tabs } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
    return (
        <HeaderHeightProvider>
            <Tabs
                screenOptions={{
                    header: (props) => <CustomTopTabComponent {...props} />,
                    headerStyle: {
                        backgroundColor: 'transparent',
                    },
                }}
                tabBar={() => null}
            >
                <Tabs.Screen name="index" />
            </Tabs>
        </HeaderHeightProvider>
    );
}
