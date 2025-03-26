import React, { useRef } from 'react';
import { TouchableOpacity, View, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import PortalizeComponent from './PortalizeComponent';
import { Modalize } from 'react-native-modalize';
import i18n from '@/utils/i18n';
import { useTranslation } from 'react-i18next'; // Thêm import này

type LanguageItem = {
    code: string;
    name: string;
};

export const LanguageSelector: React.FC = () => {
    const { t } = useTranslation(); // Thêm hook này
    const modalizeRef = useRef<Modalize>(null);
    const currentLanguage = i18n.language;

    // Danh sách ngôn ngữ với tên được dịch động
    const LANGUAGES: LanguageItem[] = [
        { code: 'vi', name: t('language_selector_component.languages.vi') },
        { code: 'en', name: t('language_selector_component.languages.en') },
    ];

    const openLanguageModal = () => {
        modalizeRef.current?.open();
    };

    const changeLanguage = async (languageCode: string): Promise<void> => {
        try {
            await i18n.changeLanguage(languageCode);
            modalizeRef.current?.close();
        } catch (error) {
            console.error('Error changing language', error);
        }
    };

    const getCurrentLanguageName = (): string => {
        const currentLang = LANGUAGES.find((lang) => lang.code === currentLanguage);
        return currentLang ? currentLang.name : t('language_selector_component.languages.vi'); // Giá trị mặc định
    };

    return (
        <>
            <TouchableOpacity
                onPress={openLanguageModal}
                className='flex-row items-center justify-center py-2 px-4 rounded-lg'
            >
                <RowComponent className='items-center space-x-2'>
                    <TextComponent
                        text={getCurrentLanguageName()}
                        className='text-center text-base'
                        style={{ color: colors.primary500 }}
                    />
                    <Ionicons name='chevron-down' size={20} color={colors.primary500} />
                </RowComponent>
            </TouchableOpacity>

            <PortalizeComponent ref={modalizeRef}>
                <View className='px-4 pb-4'>
                    <TextComponent
                        text={t('language_selector_component.select_language')} // Sử dụng t()
                        className='text-center text-lg font-bold mb-4'
                        style={{ color: colors.primary500 }}
                    />

                    <View style={{ maxHeight: 200 }}>
                        <FlatList
                            scrollEnabled={false}
                            data={LANGUAGES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => changeLanguage(item.code)}
                                    className={`py-3 px-4 rounded-lg mb-2 ${
                                        currentLanguage === item.code ? 'bg-primary-100' : 'bg-gray-100'
                                    }`}
                                >
                                    <TextComponent
                                        text={item.name}
                                        className='text-center text-base'
                                        style={{
                                            color: currentLanguage === item.code ? colors.primary500 : colors.black,
                                        }}
                                    />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </PortalizeComponent>
        </>
    );
};
