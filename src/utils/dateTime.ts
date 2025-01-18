import { format, formatDistanceStrict } from "date-fns";
import { vi } from "date-fns/locale";
export const checkExpiredTime = (time: number) => {
    return new Date(time) < new Date();
};
export const getSecondTimeLimit = (time: number) => {
    const now = new Date();
    const expired = new Date(time);
    return Math.floor((expired.getTime() - now.getTime()) / 1000);
};

export const dateTimeFormat = (time: string) => {
    if (time === "") return "";
    return format(new Date(time), "HH:mm dd/MM/yyyy ", {
        locale: vi,
    });
};

export const dateFormat = (time: string) => {
    if (time === "") return "";
    return format(new Date(time), "dd/MM/yyyy", {
        locale: vi,
    });
};

export const dateFormatLocale = (time: string) => {
    if (time === "") return "";
    if (new Date().getTime() - new Date(time).getTime() > 7 * 24 * 60 * 60 * 1000) {
        return format(new Date(time), "dd/MM/yyyy hh:mm:ss ", {
            locale: vi,
        });
    }
    return formatDistanceStrict(new Date(time), new Date(), {
        addSuffix: true,
        locale: vi,
    });
};

export const convertDateToVNTime = (time: string) => {
    const pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";
    return format(new Date(time), pattern, {
        locale: vi,
    });
};
export const checkTimeActive = (startAt: number | string, endAt: number | string) => {
    const now = new Date().getTime();
    return now >= +startAt && now <= +endAt;
};
