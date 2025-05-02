import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Platform } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { ButtonComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';

interface ChatbotIntroModalProps {
    modalRef: React.RefObject<Modalize>;
}

const ChatbotIntroModal: React.FC<ChatbotIntroModalProps> = ({ modalRef }) => {
    const { t } = useTranslation();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Fade-in animation when modal opens
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <Modalize
            ref={modalRef}
            adjustToContentHeight
            modalStyle={{
                backgroundColor: 'transparent',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                overflow: 'hidden',
                zIndex: 1000,
            }}
            handlePosition='outside'
            handleStyle={{ backgroundColor: colors.primary300 }}
            withOverlay
            overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}
        >
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
                }}
            >
                <LinearGradient
                    colors={['#1479FD', '#FF9500']} // Gradient từ conversation mode sang data mode
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        padding: 20,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        elevation: 8,
                        paddingBottom: Platform.OS === 'ios' ? 80 : 20,
                    }}
                >
                    {/* Header */}
                    <View className='items-center mb-4'>
                        <View className='w-16 h-16 rounded-full bg-[#e6f0ff] items-center justify-center mb-3'>
                            <Image
                                source={require('@/assets/images/logo_chatbot.png')}
                                style={{ width: 40, height: 40 }}
                                resizeMode='contain'
                            />
                        </View>
                        <TextComponent
                            className='text-center text-2xl font-bold text-white'
                            text={t('chatbot.intro_title')}
                        />
                        <TextComponent
                            className='text-center text-sm text-[#e6f0ff] mt-2'
                            text={t('chatbot.intro_subtitle')}
                        />
                    </View>

                    {/* Instructions */}
                    <View className='bg-white rounded-xl p-4 mb-4'>
                        {[
                            {
                                icon: 'chat-outline',
                                type: 'MaterialCommunityIcons',
                                text: t('chatbot.instruction_conversation_mode'), // "Use Conversation Mode for natural, engaging chats."
                            },
                            {
                                icon: 'database',
                                type: 'MaterialCommunityIcons',
                                text: t('chatbot.instruction_data_mode'), // "Switch to Data Mode to query and analyze data."
                            },
                            {
                                icon: 'alert-circle-outline',
                                text: t('chatbot.instruction_4'),
                            },
                            {
                                icon: 'rocket-outline',
                                type: 'Ionicons',
                                text: t('chatbot.instruction_get_started'), // "Start chatting now and explore all features!"
                            },
                            {
                                icon: 'shield-checkmark-outline',
                                text: t('chatbot.instruction_5'),
                                type: 'Ionicons',
                            },
                        ].map((item, index) => (
                            <View key={`instruction-${index}`} className='flex-row items-start mb-3'>
                                {item.type === 'Ionicons' ? (
                                    <Ionicons
                                        name={item.icon as any}
                                        size={22}
                                        color={colors.primary400}
                                        style={{ marginTop: 2 }}
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name={item.icon as any}
                                        size={22}
                                        color={colors.primary400}
                                        style={{ marginTop: 2 }}
                                    />
                                )}
                                <TextComponent className='ml-3 flex-1 text-gray-800' text={item.text} />
                            </View>
                        ))}
                    </View>

                    {/* Action Button */}
                    <View className='mt-3'>
                        <ButtonComponent
                            title={t('chatbot.get_started')} // Ví dụ: "Start Chatting"
                            onPress={() => modalRef.current?.close()}
                            type='primary'
                            size='large'
                        />
                    </View>
                </LinearGradient>
            </Animated.View>
        </Modalize>
    );
};

export default ChatbotIntroModal;
