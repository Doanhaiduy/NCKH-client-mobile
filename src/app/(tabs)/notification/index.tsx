import { ContainerComponent, NotificationCard } from '@/components';
import { NotificationData } from '@/mockData';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function NotificationPage() {
    return (
        <ContainerComponent iconLeft="logo" title="Thông báo" search isScroll>
            {NotificationData.map((item, index) => (
                <NotificationCard data={item} isNew={item.id === 1} key={index} />
            ))}
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
