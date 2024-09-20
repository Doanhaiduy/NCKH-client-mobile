import { format, formatDistanceStrict } from 'date-fns';
import { vi } from 'date-fns/locale';
export const checkExpiredTime = (time: number) => {
    return new Date(time) < new Date();
};
export const getSecondTimeLimit = (time: number) => {
    const now = new Date();
    const expired = new Date(time);
    return Math.floor((expired.getTime() - now.getTime()) / 1000);
};
export const dateFormat = (time: string) => {
    return formatDistanceStrict(new Date(time), new Date(), {
        locale: vi,
    });
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
