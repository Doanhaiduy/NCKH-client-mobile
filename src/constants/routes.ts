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
    index: number;
}[] = [
    {
        index: 0,
        name: 'Tất cả',
        route: '/(home)/',
    },
    { index: 1, name: 'Đang diễn ra', route: '/ongoing-events/' },
    { index: 2, name: 'Đã đăng ký', route: '/registered-events/' },
    { index: 3, name: 'Đã diễn ra', route: '/finished-events/' },
    { index: 4, name: 'Tin tức', route: '/news/' },
];
export { RoutesDrawerDropDown, RoutesCategories };
