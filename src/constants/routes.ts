import { router } from 'expo-router';

const RoutesDrawerDropDown = [
    {
        name: 'Đã đăng ký',
        route: '/registered-activity/',
    },
    {
        name: 'Đang diễn ra',
        route: '/ongoing-activity/',
    },
    {
        name: 'Đã diễn ra',
        route: '/finished-activity/',
    },
];

const RoutesCategories: {
    name: string;
    route: string;
}[] = [
    {
        name: 'Tất cả',
        route: '/(home)/',
    },
    {
        name: 'Đang diễn ra',
        route: '/ongoing-events/',
    },
    {
        name: 'Đã đăng ký',
        route: '/registered-events/',
    },
    {
        name: 'Đã diễn ra',
        route: '/finished-events/',
    },
    {
        name: 'Tin tức',
        route: '/news/',
    },
];
export { RoutesDrawerDropDown, RoutesCategories };
