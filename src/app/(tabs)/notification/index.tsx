import notificationAPI from '@/apis/notificationApi';
import userAPI from '@/apis/userApi';
import { ContainerComponent, NotificationCard } from '@/components';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useRefreshing } from '@/hooks/useRefreshing';
import { LoadingModal, NotificationModal } from '@/modals';
import { authSelector } from '@/stores/reducers/authReducer';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';

export default function NotificationPage() {
    const { authData } = useSelector(authSelector);
    const [visible, setVisible] = React.useState(false);
    const [notificationDetails, setNotificationDetails] = React.useState<_Notification | null>(null);
    const { data, isFetching, refetch } = useQuery<_Notification[]>({
        queryKey: ['notifications', authData?._id],
        queryFn: () => userAPI.getNotifications(authData?._id || ''),
        refetchInterval: 30000,
    });
    const { refreshing, handleRefresh } = useRefreshing(refetch);

    const { notification } = usePushNotifications();

    useEffect(() => {
        if (notification) {
            refetch();
        }
    }, [notification, refetch]);

    const handleReadNotification = async (_id: string, isRead: boolean) => {
        setVisible(true);

        if (isRead) return;
        try {
            const res = await notificationAPI.readNotification({ _id, userId: authData?._id || '' });
            if (res) {
                refetch();
            }
        } catch (error) {
            console.log('Error read notification', error);
        }
    };

    const handleDetails = () => {
        setVisible(false);
        if (notificationDetails?.type === 'event') {
            if (notificationDetails.actionId) {
                router.replace(`/attendance/${notificationDetails.actionId}`);
            }
        }
        if (notificationDetails?.type === 'training-point') {
            router.push(`/training-point`);
        }
        if (notificationDetails?.type === 'post') {
            if (notificationDetails.actionId) {
                router.push(`/activity/${notificationDetails.actionId}`);
            }
        }
    };

    return (
        <ContainerComponent
            iconLeft='logo'
            title='Thông báo'
            notification
            isScroll
            handleRefresh={handleRefresh}
            _refreshing={refreshing}
        >
            {(data ?? []).length > 0 ? (
                data?.map((item, index) => (
                    <NotificationCard
                        data={item}
                        isNew={!item.isRead}
                        key={item._id}
                        onPress={() => {
                            handleReadNotification(item._id, item.isRead);
                            setNotificationDetails(item);
                        }}
                    />
                ))
            ) : (
                <Text>Không có thông báo nào</Text>
            )}
            {/* {isFetching && <LoadingModal />} */}
            <NotificationModal
                visible={visible}
                onClose={() => setVisible(false)}
                onDetails={handleDetails}
                data={notificationDetails || null}
            />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
