import { format, formatDistanceToNow } from 'date-fns';
import { vi, es } from 'date-fns/locale';
export const checkExpiredTime = (time: number) => {
    return new Date(time) < new Date();
};
export const getSecondTimeLimit = (time: number) => {
    const now = new Date();
    const expired = new Date(time);
    return Math.floor((expired.getTime() - now.getTime()) / 1000);
};
export const dateFormat = (time: string) => {
    // return format(new Date(time), 'hh:mm a', {
    //     locale: vi,
    // });
    return formatDistanceToNow(new Date(time), { addSuffix: true, locale: vi });
};
export const convertDateToVNTime = (time: string) => {
    const pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";
    return format(new Date(time), pattern, {
        locale: vi,
    });
};
export const checkTimeActive = (startAt: string | number, endAt: string | number) => {
    const now = new Date();
    const start = convertDateToVNTime(startAt.toString());
    const end = convertDateToVNTime(endAt.toString());

    return now >= new Date(start) && now <= new Date(end);
};
