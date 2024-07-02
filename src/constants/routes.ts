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

const RoutesCategories = [
    {
        name: 'Tất cả',
        route: '/home-backup',
    },
    {
        name: 'Đang diễn ra',
        route: '/home-backup/sukien',
    },
    {
        name: 'Đã diễn ra',
        route: '/home-backup/sukien2',
    },
    {
        name: 'Tin tức',
        route: '/home-backup/tintuc',
    },
];
export { RoutesDrawerDropDown, RoutesCategories };
