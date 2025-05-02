import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

interface EmptyChatProps {
    onPress: (message: string) => void;
}

const EmptyChat: React.FC<EmptyChatProps> = ({ onPress }) => {
    const { t } = useTranslation();

    const suggestionItems = [
        {
            icon: 'scan-outline',
            title: t('chatbot.empty_state.suggestions.qr_attendance'),
            gradient: ['#4B9CFF', '#2D7CDF'],
        },
        {
            icon: 'code-slash-outline',
            title: t('chatbot.empty_state.suggestions.programming'),
            gradient: ['#FF6B6B', '#FF4757'],
        },
        {
            icon: 'clipboard-outline',
            title: t('chatbot.empty_state.suggestions.assessment'),
            gradient: ['#26C485', '#1FAA74'],
        },

        {
            icon: 'help-circle-outline',
            title: t('chatbot.empty_state.suggestions.contact_support'),
            gradient: ['#FF9F43', '#FF8C00'],
        },
    ];

    return (
        <View className='flex-1 justify-center items-center p-6'>
            {/* Logo and Header */}
            <View className='items-center mb-8'>
                <Image
                    source={require('@/assets/images/logo_chatbot.png')}
                    style={{ width: width * 0.4, height: width * 0.4 }}
                    resizeMode='contain'
                />
                <Text className='text-xl font-bold text-[#333333] mt-6 text-center'>
                    {t('chatbot.empty_state.header')}
                </Text>
                <Text className='text-[#777777] mt-2 text-center leading-5 px-4'>
                    {t('chatbot.empty_state.subheader')}
                </Text>
            </View>

            {/* Suggestions */}
            <View className='w-full mt-4'>
                <Text className='text-[#555555] font-medium mb-3 px-1'>
                    {t('chatbot.empty_state.suggestions_title')}
                </Text>

                {suggestionItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onPress(item.title)}
                        className='mb-3 overflow-hidden rounded-xl'
                        style={styles.cardShadow}
                    >
                        <LinearGradient
                            // @ts-ignore
                            colors={item.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className='py-3 px-4 flex-row items-center'
                        >
                            <View className='bg-[#ffffff33] p-2 rounded-full mr-3'>
                                <Ionicons name={item.icon as any} size={20} color='#FFFFFF' />
                            </View>
                            <Text className='text-white font-medium flex-1' numberOfLines={2}>
                                {item.title}
                            </Text>
                            <Ionicons name='chevron-forward' size={20} color='#FFFFFF' />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Bottom hint */}
            <View className='mt-6 flex-row items-center'>
                <Ionicons name='bulb-outline' size={16} color='#4B9CFF' />
                <Text className='text-[#4B9CFF] text-xs ml-1'>{t('chatbot.empty_state.suggestions.bottom_hint')}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default EmptyChat;
