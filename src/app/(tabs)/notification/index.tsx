import notificationAPI from "@/apis/notificationApi";
import userAPI from "@/apis/userApi";
import { ContainerComponent, NotificationCard } from "@/components";
import { useRefreshing } from "@/hooks/useRefreshing";
import { LoadingModal, NotificationModal } from "@/modals";
import { authSelector } from "@/stores/reducers/authReducer";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

export default function NotificationPage() {
    const { authData } = useSelector(authSelector);
    const [visible, setVisible] = React.useState(false);

    const { data, isFetching, refetch } = useQuery<_Notification[]>({
        queryKey: ["notifications", authData?._id],
        queryFn: () => userAPI.getNotifications(authData?._id || ""),
    });
    const { refreshing, handleRefresh } = useRefreshing(refetch);

    const handleReadNotification = async (_id: string, isRead: boolean) => {
        setVisible(true);

        if (isRead) return;
        try {
            const res = await notificationAPI.readNotification({ _id, userId: authData?._id || "" });
            if (res) {
                refetch();
            }
        } catch (error) {
            console.log("Error read notification", error);
        }
    };

    return (
        <ContainerComponent
            iconLeft="logo"
            title="Thông báo"
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
                        onPress={() => handleReadNotification(item._id, item.isRead)}
                    />
                ))
            ) : (
                <Text>Không có thông báo nào</Text>
            )}
            {isFetching && <LoadingModal />}
            <NotificationModal visible={visible} onClose={() => setVisible(false)} onDetails={() => {}} />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
