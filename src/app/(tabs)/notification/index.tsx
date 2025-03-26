import notificationAPI from '@/apis/notificationApi';
import userAPI from '@/apis/userApi';
import { ContainerComponent, NotificationCard } from '@/components';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useRefreshing } from '@/hooks/useRefreshing';
import { NotificationModal } from '@/modals';
import { authSelector } from '@/stores/reducers/authReducer';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function NotificationPage() {
    const { authData } = useSelector(authSelector);
    const [visible, setVisible] = React.useState(false);
    const { t } = useTranslation();

    const router = useCustomRouter();
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
                router.navigateTo(`/(tabs)/attendance/${notificationDetails.actionId}`);
            }
        }
        if (notificationDetails?.type === 'training-point') {
            router.navigateTo(`/(tabs)/training-point`);
        }
        if (notificationDetails?.type === 'post') {
            if (notificationDetails.actionId) {
                router.navigateTo(`/(tabs)/(home)/activity/${notificationDetails.actionId}`);
            }
        }
    };

    return (
        <ContainerComponent
            iconLeft='logo'
            title={t('notification.title')}
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
                <Text>{t('notification.no_notifications')}</Text>
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
