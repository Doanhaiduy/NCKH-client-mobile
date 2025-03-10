// types/i18n.d.ts
import 'react-i18next';
import translation from '../assets/locales/en/translation.json';

declare module 'react-i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: {
            translation: typeof translation;
        };
    }
}
