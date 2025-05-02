import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-native-markdown-display';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

// Props for ChatMessage component
interface ChatMessageProps {
    message: Message;
    isUser: boolean;
    person_avt?: string;
    timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    isUser,
    timestamp,
    person_avt = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png',
}) => {
    const { t, i18n } = useTranslation();
    const [copied, setCopied] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    // Xác định mode của tin nhắn (mặc định là 'chat' nếu không có)
    const messageMode = message.mode || 'chat';

    // Reset copy status after timeout
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (copied) {
            timeout = setTimeout(() => {
                setCopied(false);
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }, 2000);
        }
        return () => clearTimeout(timeout);
    }, [copied, fadeAnim]);

    const messageTime = (() => {
        const messageDate = new Date(timestamp || Date.now());
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Time formatting for current language
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
        };

        const dateOptions: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
        };

        // Check if the message is from today
        if (messageDate.toDateString() === today.toDateString()) {
            return messageDate.toLocaleTimeString(i18n.language, timeOptions);
        }
        // Check if the message is from yesterday
        else if (messageDate.toDateString() === yesterday.toDateString()) {
            const yesterdayText = i18n.language === 'vi' ? 'Hôm qua' : 'Yesterday';
            return `${yesterdayText}, ${messageDate.toLocaleTimeString(i18n.language, timeOptions)}`;
        }
        // For older messages
        else {
            return (
                messageDate.toLocaleDateString(i18n.language, dateOptions) +
                ', ' +
                messageDate.toLocaleTimeString(i18n.language, timeOptions)
            );
        }
    })();

    const processContent = (content: string) => {
        return content.replace(/【.*?】/g, '');
    };

    const processedContent = processContent(message.content);

    const handleCopy = async () => {
        try {
            await Clipboard.setStringAsync(processedContent);
            // Hiệu ứng rung nhẹ khi sao chép thành công
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setCopied(true);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } catch (error) {
            console.error('Copy failed:', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    // Xác định style dựa vào mode
    const getMessageStyles = () => {
        if (isUser) {
            if (messageMode === 'data') {
                return {
                    container: 'bg-[#FF9500] rounded-tr-none rounded-tr-none border-l-4 border-[#FF2500]',
                    textColor: 'text-white',
                    icon: <MaterialIcons name='data-usage' size={14} color='#fff' />,
                    label: t('Dữ liệu'),
                };
            } else {
                return {
                    container: 'bg-primary-300 rounded-tr-none border-l-4 border-primary-500',
                    textColor: 'text-white',
                    icon: <MaterialCommunityIcons name='chat-outline' size={14} color='#fff' />,
                    label: t('Hội thoại'),
                };
            }
        } else {
            return {
                container: 'bg-text-100 rounded-tl-none',
                textColor: 'text-gray-800',
                icon: null,
                label: null,
            };
        }
    };

    const styles = getMessageStyles();

    return (
        <View className={`flex-row mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <View className='w-10 h-10 rounded-full bg-primary-100 mr-2 items-center justify-center'>
                    <Image
                        source={require('@/assets/images/logo_chatbot.png')}
                        style={{ width: 30, height: 30 }}
                        resizeMode='contain'
                    />
                </View>
            )}

            <View className={`p-3 rounded-2xl ${styles.container} max-w-[75%] relative`}>
                {/* Mode indicator cho tin nhắn người dùng */}
                {isUser && (
                    <View className='flex-row items-center mb-1'>
                        {styles.icon}
                        <Text className='text-xs ml-1 text-white font-medium'>{styles.label}</Text>
                    </View>
                )}

                <View className={!isUser ? 'pr-4' : ''}>
                    {isUser ? (
                        <Text className={styles.textColor}>{message.content}</Text>
                    ) : (
                        <Markdown
                            style={{
                                body: { color: '#2D3748' }, // text-gray-800
                                bullet_list: { marginTop: 4, marginBottom: 4 },
                                ordered_list: { marginTop: 4, marginBottom: 4 },
                                strong: { fontWeight: 'bold' },
                                paragraph: { marginTop: 2, marginBottom: 2 },
                            }}
                        >
                            {processedContent}
                        </Markdown>
                    )}
                    <Text className={`text-xs mt-1 ${isUser ? 'text-primary-100' : 'text-gray-500'} text-right`}>
                        {messageTime}
                    </Text>
                    {!isUser && (
                        <View className='absolute bottom-[-10] left-0 z-10'>
                            <TouchableOpacity
                                className={`flex-row items-center rounded-bl-lg rounded-tr-lg px-2 py-1.5 ${
                                    copied ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                                onPress={handleCopy}
                                activeOpacity={0.7}
                            >
                                <Feather
                                    name={copied ? 'check' : 'copy'}
                                    size={16}
                                    color={copied ? '#888888' : '#555555'}
                                />
                                <Animated.Text
                                    style={{
                                        opacity: fadeAnim,
                                        transform: [
                                            {
                                                translateX: fadeAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [-5, 0],
                                                }),
                                            },
                                        ],
                                    }}
                                    className={`ml-1 text-xs ${copied ? 'text-[#888888]' : 'text-gray-700'}`}
                                >
                                    {t('Đã sao chép')}
                                </Animated.Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {isUser && (
                <View className='w-10 h-10 rounded-full bg-primary-100 ml-2 items-center justify-center'>
                    <Image
                        source={{
                            uri: person_avt || 'https://i.imgur.com/Qx5oFep.png',
                        }}
                        style={{ width: 40, height: 40 }}
                        resizeMode='cover'
                        className='rounded-full'
                    />
                </View>
            )}
        </View>
    );
};

export default React.memo(ChatMessage);
