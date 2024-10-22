import notificationAPI from '@/apis/notificationApi';
import userAPI from '@/apis/userApi';
import { ContainerComponent, NotificationCard } from '@/components';
import { LoadingModal } from '@/modals';
import { authSelector } from '@/stores/reducers/authReducer';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

export default function NotificationPage() {
    const { authData } = useSelector(authSelector);

    const { data, isFetching, refetch } = useQuery<_Notification[]>({
        queryKey: ['notifications', authData?.id],
        queryFn: () => userAPI.getNotifications(authData?.id || ''),
    });

    const handleReadNotification = async (id: string, isRead: boolean) => {
        if (isRead) return;
        try {
            const res = await notificationAPI.readNotification({ id, userId: authData?.id || '' });
            if (res) {
                refetch();
            }
        } catch (error) {
            console.log('Error read notification', error);
        }
    };

    return (
        <ContainerComponent
            iconLeft="logo"
            title="Thông báo"
            notification
            isScroll
            handleRefresh={refetch}
            _refreshing={isFetching}
        >
            {(data ?? []).length > 0 ? (
                data?.map((item, index) => (
                    <NotificationCard
                        data={item}
                        isNew={!item.isRead}
                        key={item._id}
                        onPress={() => handleReadNotification(item._id, item.isRead)}
                    />
                ))
            ) : (
                <Text>Không có thông báo nào</Text>
            )}
            <LoadingModal visible={isFetching} />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
