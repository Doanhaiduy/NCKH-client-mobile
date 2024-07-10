import { CustomTopTabComponent } from '@/layouts/Components';
import { Tabs } from 'expo-router';
import React from 'react';

export default function BackupHomeLayout() {
    return (
        <Tabs
            screenOptions={{
                header: (props) => <CustomTopTabComponent {...props} />,
            }}
            tabBar={() => null}
        />
    );
}
