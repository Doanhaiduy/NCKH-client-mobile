import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const checkHasErr = (data: object) => {
    return Object.values({ ...data }).some(
        (value, index) => value !== undefined && Object.keys(data)[index] !== 'root',
    );
};

export const checkExpiredTime = (time: number) => {
    return new Date(time) < new Date();
};

export const getSecondTimeLimit = (time: number) => {
    const now = new Date();
    const expired = new Date(time);
    return Math.floor((expired.getTime() - now.getTime()) / 1000);
};

export const Regex = {
    fullName: new RegExp(
        /^[a-zA-ZÃ€ÃÃ‚ÃƒÃˆÃ‰ÃŠÃŒÃÃ’Ã“Ã”Ã•Ã™ÃšÄ‚ÄÄ¨Å¨Æ Ã Ã¡Ã¢Ã£Ã¨Ã©ÃªÃ¬Ã­Ã²Ã³Ã´ÃµÃ¹ÃºÄƒÄ‘Ä©Å©Æ¡Æ¯Ä‚áº áº¢áº¤áº¦áº¨áºªáº¬áº®áº°áº²áº´áº¶áº¸áººáº¼á»€á»€á»‚áº¾Æ°Äƒáº¡áº£áº¥áº§áº©áº«áº­áº¯áº±áº³áºµáº·áº¹áº»áº½á»á»á»ƒáº¿á»„á»†á»ˆá»Šá»Œá»Žá»á»’á»”á»–á»˜á»šá»œá»žá» á»¢á»¤á»¦á»¨á»ªá»…á»‡á»‰á»‹á»á»á»‘á»“á»•á»—á»™á»›á»á»Ÿá»¡á»£á»¥á»§á»©á»«á»¬á»®á»°á»²á»´Ãá»¶á»¸á»­á»¯á»±á»³á»µá»·á»¹\s\W|_]+$/,
    ),
    password: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)([A-Za-z\d\W_]*)$/),
    email: new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
};

export const obfuscateEmail = (email: string): string => {
    return email.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => a + b.replace(/./g, '*') + c);
};

export const dateFormat = (time: string) => {
    return format(new Date(time), 'dd MMM, yyyy', {
        locale: vi,
    });
};
