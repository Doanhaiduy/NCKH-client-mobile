// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import en from '../locales/en/translation.json';
import vi from '../locales/vi/translation.json';

export const LANGUAGES = {
    en: {
        translation: en,
    },
    vi: {
        translation: vi,
    },
};

export type LanguageCode = keyof typeof LANGUAGES;
const LANG_CODES = Object.keys(LANGUAGES) as LanguageCode[];

const LANGUAGE_DETECTOR = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lng: LanguageCode) => void): Promise<void> => {
        try {
            const authStorage = await AsyncStorage.getItem('auth');
            if (authStorage) {
                const parsedAuth = JSON.parse(authStorage);
                const authLanguage = parsedAuth.lang;

                if (authLanguage && LANG_CODES.includes(authLanguage as LanguageCode)) {
                    return callback(authLanguage as LanguageCode);
                }
            }

            const storedLanguage = await AsyncStorage.getItem('USER_LANGUAGE');
            if (storedLanguage && LANG_CODES.includes(storedLanguage as LanguageCode)) {
                return callback(storedLanguage as LanguageCode);
            }

            const phoneLanguage = Localization.getLocales()[0].languageCode;
            const supportedLanguage = LANG_CODES.includes(phoneLanguage as LanguageCode)
                ? (phoneLanguage as LanguageCode)
                : 'vi';
            console.log('supportedLanguage', supportedLanguage);

            return callback(supportedLanguage);
        } catch (error) {
            console.log('Error detecting language:', error);
            return callback('vi');
        }
    },
    init: (): void => {},
    cacheUserLanguage: async (language: LanguageCode): Promise<void> => {
        try {
            await AsyncStorage.setItem('USER_LANGUAGE', language);

            const authStorage = await AsyncStorage.getItem('auth');
            if (authStorage) {
                const parsedAuth = JSON.parse(authStorage);
                parsedAuth.language = language;
                await AsyncStorage.setItem('auth', JSON.stringify(parsedAuth));
            }
        } catch (error) {
            console.log('Error caching language:', error);
        }
    },
};

i18n.use(LANGUAGE_DETECTOR)
    .use(initReactI18next)
    .init({
        resources: LANGUAGES,
        fallbackLng: 'vi',
        compatibilityJSON: 'v4',
        react: {
            useSuspense: false,
        },
        interpolation: {
            escapeValue: false,
        },
        defaultNS: 'translation',
    });

export default i18n;
