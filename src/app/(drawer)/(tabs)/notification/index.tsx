import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ContainerComponent, NotificationCard } from '@/components';

const NotificationData = [
    {
        title: 'Tin tức',
        description: 'Lịch thi đấu chính thức giải Bóng chuyền Lịch thi đấu chính thức giải Bóng chuyền...',
        time: 'Hôm nay, 07:02',
        id: '1',
    },
    {
        title: 'Điểm danh',
        description: 'Chào cờ khoa Công nghệ thông tin ngày Chào cờ khoa Công nghệ thông tin ngày...',
        time: '4 ngày, 17:30',
        id: '1',
    },
    {
        title: 'Hoạt động ngoại khóa',
        description: 'Hưởng ứng cuộc thi trực tuyến tìm hiểu về Hưởng ứng cuộc thi trực tuyến tìm hiểu về...',
        time: '2 tuần, 17:30',
        id: '2',
    },
    {
        title: 'Hệ thống',
        description: 'Minh chứng bổ sung đã được duyệt',
        time: '1 tháng, 17:30',
        id: '1',
    },
    {
        title: 'Tin tức',
        description: 'Lịch thi đấu chính thức giải Bóng chuyền Lịch thi đấu chính thức giải Bóng chuyền...',
        time: 'Hôm nay, 07:02',
        id: '2',
    },
    {
        title: 'Điểm danh',
        description: 'Chào cờ khoa Công nghệ thông tin ngày Chào cờ khoa Công nghệ thông tin ngày...',
        time: '4 ngày, 17:30',
        id: '1',
    },
    {
        title: 'Hoạt động ngoại khóa',
        description: 'Hưởng ứng cuộc thi trực tuyến tìm hiểu về Hưởng ứng cuộc thi trực tuyến tìm hiểu về...',
        time: '2 tuần, 17:30',
        id: '2',
    },
    {
        title: 'Hệ thống',
        description: 'Minh chứng bổ sung đã được duyệt',
        time: '1 tháng, 17:30',
        id: '2',
    },
];

export default function NotificationPage() {
    return (
        <ContainerComponent iconLeft="menu" title="Thông báo" search isScroll>
            {NotificationData.map((item, index) => (
                <NotificationCard data={item} isNew={item.id === '1'} key={index} />
            ))}
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
