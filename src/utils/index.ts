const CryptoJS = require('crypto-js');

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const checkHasErr = (data: object) => {
    return Object.values({ ...data }).some(
        (value, index) => value !== undefined && Object.keys(data)[index] !== 'root',
    );
};

export const decryptData = (cipherText: string): EncryptedEventDetails | null => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, process.env.EXPO_PUBLIC_CRYPTO_SECRET_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) {
            return null;
        }
        try {
            const decryptedData = JSON.parse(decryptedString);
            return decryptedData;
        } catch (jsonError) {
            return null;
        }
    } catch (error) {
        return null;
    }
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

export const romanize = (num: string) => {
    var digits = String(+num).split(''),
        key = [
            '',
            'C',
            'CC',
            'CCC',
            'CD',
            'D',
            'DC',
            'DCC',
            'DCCC',
            'CM',
            '',
            'X',
            'XX',
            'XXX',
            'XL',
            'L',
            'LX',
            'LXX',
            'LXXX',
            'XC',
            '',
            'I',
            'II',
            'III',
            'IV',
            'V',
            'VI',
            'VII',
            'VIII',
            'IX',
        ],
        roman = '',
        i = 3;
    while (i--) roman = (key[+digits.pop()! + i * 10] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
};

export const flattenCriteria = (criteria: Criteria[]) => {
    let result: {
        id: string;
        title: string;
        maxScore: number;
        totalScore: number;
        require: boolean;
        level: number;
        criteriaCode: string;
        evidence?: Evidence;
    }[] = [];

    const traverse = (criteria: Criteria[]) => {
        criteria?.forEach((item) => {
            result.push({
                id: item.id,
                title: item.title,
                maxScore: item.maxScore,
                totalScore: item.totalScore,
                level: item.level,
                require: item.evidenceType !== 'none',
                evidence: item.evidenceType === 'none' ? undefined : item.evidence ? item.evidence : undefined,
                criteriaCode: item.criteriaCode,
            });

            if (item.subCriteria && item.subCriteria.length > 0) {
                traverse(item.subCriteria);
            }
        });
    };

    traverse(criteria);
    return result;
};
