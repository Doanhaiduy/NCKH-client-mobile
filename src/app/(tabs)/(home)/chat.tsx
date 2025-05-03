import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Keyboard,
    StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import { useSelector } from 'react-redux';
import { Image } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useTranslation } from 'react-i18next';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';

// Local imports
import chatAPI from '@/apis/chatApi';
import { authSelector } from '@/stores/reducers/authReducer';
import { ChatMessage, EmptyChat, TypingIndicator, ChatbotIntroModal } from '@/components';

const EnhancedChatScreen: React.FC = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    const [dataMode, setDataMode] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const messagesPerPage = 10;
    const { authData } = useSelector(authSelector);

    const flatListRef = useRef<FlatList<Message>>(null);
    const inputRef = useRef<TextInput>(null);
    const modalizeShowInfo = useRef<Modalize>(null);

    // Animation for mode switch
    const animationProgress = useSharedValue(0);

    useEffect(() => {
        animationProgress.value = withTiming(dataMode ? 1 : 0, { duration: 300 });
    }, [dataMode]);

    const animatedModeStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: isLoading
                ? '#cccccc'
                : interpolateColor(animationProgress.value, [0, 1], ['#1479FD', '#FF9500']),
        };
    });

    useEffect(() => {
        if (Platform.OS === 'ios') {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    }, []);

    useEffect(() => {
        if (messages.length <= 0 && !isFetching) {
            setTimeout(() => {
                modalizeShowInfo.current?.open();
            }, 300);
        }
    }, [messages]);

    useEffect(() => {
        let subscriptions: any[] = [];

        if (Platform.OS === 'ios') {
            const keyboardWillShow = Keyboard.addListener('keyboardWillShow', (e) => {
                setKeyboardVisible(true);
                setKeyboardHeight(e.endCoordinates.height);
                if (messages.length > 0) {
                    scrollToBottom(true);
                }
            });

            const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
                setKeyboardVisible(false);
                setKeyboardHeight(0);
            });

            subscriptions = [keyboardWillShow, keyboardWillHide];
        } else {
            const keyboardDidShow = Keyboard.addListener('keyboardDidShow', (e) => {
                setKeyboardVisible(true);
                setKeyboardHeight(e.endCoordinates.height);
                if (messages.length > 0) {
                    scrollToBottom(true);
                }
            });

            const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
                setKeyboardVisible(false);
                setKeyboardHeight(0);
            });

            subscriptions = [keyboardDidShow, keyboardDidHide];
        }

        return () => {
            subscriptions.forEach((subscription) => subscription.remove());
        };
    }, [messages]);

    // Fetch chat history when component is focused
    useFocusEffect(
        useCallback(() => {
            fetchChatHistory();
            return () => {};
        }, []),
    );

    // Function to scroll to bottom
    const scrollToBottom = (animated = true) => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToOffset({ offset: 0, animated });
        }
    };

    // Fetch chat history from API
    const fetchChatHistory = async () => {
        try {
            setIsFetching(true);
            const response = await chatAPI.getChatHistory({
                page: 1,
                size: messagesPerPage,
            });

            if (response && response.messages && Array.isArray(response.messages)) {
                const filteredMessages = response.messages.filter(
                    (message: Message) => message.role !== 'system' && message.content,
                );

                // Only reverse if the API returns oldest-to-newest
                setMessages(filteredMessages);
                setTotalPages(response.totalPages || 1);
                setPage(1);
                setHasMoreMessages(response.totalPages > 1);

                // Scroll to bottom after initial load
                setTimeout(() => scrollToBottom(false), 100);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        } finally {
            setIsFetching(false);
        }
    };

    // Fetch more messages when scrolling up
    const fetchMoreMessages = async () => {
        if (page >= totalPages || isFetching || isLoadingMore || !hasMoreMessages) return;

        try {
            setIsLoadingMore(true);
            const nextPage = page + 1;

            const response = await chatAPI.getChatHistory({
                page: nextPage,
                size: messagesPerPage,
            });

            if (response && response.messages && Array.isArray(response.messages)) {
                const filteredMessages = response.messages.filter(
                    (message: Message) => message.role !== 'system' && message.content,
                );

                // Add older messages to the end of the list (since FlatList is inverted)
                setMessages((prev) => [...prev, ...filteredMessages]);
                setPage(nextPage);
                setHasMoreMessages(nextPage < response.totalPages);
            }
        } catch (error) {
            console.error('Error loading more messages:', error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const deleteChatHistory = async () => {
        try {
            setIsFetching(true);
            await chatAPI.clearChatHistory();
            setMessages([]);
            setPage(1);
            setTotalPages(1);
            setHasMoreMessages(false);
        } catch (error) {
            console.error('Error deleting chat history:', error);
            Alert.alert('Error', t('chatbot.error.delete_history'));
        } finally {
            setIsFetching(false);
        }
    };

    // Toggle data mode with haptic feedback
    const toggleDataMode = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setDataMode((prevMode) => !prevMode);
    };

    // Handle sending a message
    const handleSendMessage = async (message?: string) => {
        const inputMessageToSend = message || inputMessage.trim();
        if (!inputMessageToSend || isLoading) return;

        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const userMessage: Message = {
            role: 'user',
            content: inputMessageToSend,
            mode: dataMode ? 'data' : 'conversation',
            timestamp: new Date().toISOString(),
        };

        // Add new message at the beginning (will appear at the bottom with inverted list)
        setMessages((prevMessages) => [userMessage, ...prevMessages]);

        // Clear input and scroll to bottom
        setInputMessage('');
        scrollToBottom(true);
        setIsLoading(true);

        try {
            const assistantResponse = await chatAPI.sendMessage(
                {
                    message: inputMessageToSend,
                    mode: dataMode ? 'data' : 'conversation',
                },
                {
                    timeout: 300000,
                },
            );

            if (assistantResponse) {
                const botMessage = {
                    role: 'assistant',
                    content: assistantResponse.response,
                    mode: dataMode ? 'data' : 'conversation',
                    timestamp: new Date().toISOString(),
                } as Message;

                // Add bot response at the beginning (will appear at the bottom with inverted list)
                setMessages((prevMessages) => [botMessage, ...prevMessages]);

                // Ensure we scroll to see the new message
                setTimeout(() => scrollToBottom(true), 100);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', t('chatbot.error.send'));
        } finally {
            setIsLoading(false);
        }
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;

        return (
            <View style={{ padding: 20 }}>
                <ActivityIndicator size='small' color='#4B9CFF' />
            </View>
        );
    };

    // Styles
    const styles = StyleSheet.create({
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderTopWidth: 1,
            borderTopColor: '#e5e5e5',
            backgroundColor: '#ffffff',
            borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
            borderBottomColor: '#e5e5e5',
        },
        textInput: {
            flex: 1,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: Platform.OS === 'ios' ? 10 : 8,
            backgroundColor: Platform.OS === 'ios' ? '#f5f5f5' : '#f1f1f1',
            maxHeight: 100,
            fontSize: 16,
            color: '#000000',
        },
        sendButtonActive: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#1479FD',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
        },
        sendButtonInactive: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#cccccc',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
        },
        modeSwitchButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            marginRight: 8,
        },
        modeIcon: {
            marginRight: 4,
        },
        modeText: {
            fontSize: 12,
            fontWeight: '600',
            color: '#FFFFFF',
        },
    });

    const renderChatList = () => (
        <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => (
                <ChatMessage
                    message={item}
                    isUser={item.role === 'user'}
                    person_avt={authData?.avatar}
                    timestamp={item.timestamp}
                />
            )}
            keyExtractor={(_, index) => `message-${index}`}
            inverted={messages.length > 0}
            contentContainerStyle={{
                padding: 16,
                paddingBottom: keyboardVisible ? (Platform.OS === 'ios' ? 8 : 16) : 24,
                flexGrow: 1,
            }}
            ListEmptyComponent={
                <EmptyChat
                    onPress={(message) => {
                        handleSendMessage(message);
                    }}
                />
            }
            ListFooterComponent={renderFooter}
            onEndReached={fetchMoreMessages}
            onEndReachedThreshold={0.3}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={10}
            maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 10,
            }}
        />
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style='dark' />
            {/* Header */}
            <View className='flex-row items-center justify-between px-4 py-2 border-b border-[#e5e5e5]'>
                <View className='flex-row items-center'>
                    <TouchableOpacity onPress={() => router.back()} className='mr-2 p-1'>
                        <Ionicons name='chevron-back' size={24} color='#4B9CFF' />
                    </TouchableOpacity>
                    <View className='w-10 h-10 rounded-full bg-[#e6f0ff] mr-2 items-center justify-center'>
                        <Image
                            source={require('@/assets/images/logo_chatbot.png')}
                            style={{ width: 30, height: 30 }}
                            resizeMode='contain'
                        />
                    </View>
                    <View>
                        <Text className='text-lg font-bold text-[#333333]'>{t('chatbot.title')}</Text>
                        <TouchableOpacity onPress={toggleDataMode} disabled={isLoading}>
                            <Animated.View style={[styles.modeSwitchButton, animatedModeStyle]}>
                                {dataMode ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcons
                                            name='data-usage'
                                            size={16}
                                            color='#FFFFFF'
                                            style={styles.modeIcon}
                                        />
                                        <Text style={styles.modeText}>
                                            {isLoading ? t('chatbot.thinking') : t('chatbot.data_mode')}
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialCommunityIcons
                                            name='chat-outline'
                                            size={16}
                                            color='#FFFFFF'
                                            style={styles.modeIcon}
                                        />
                                        <Text style={styles.modeText}>
                                            {isLoading ? t('chatbot.thinking') : t('chatbot.conversation_mode')}
                                        </Text>
                                    </View>
                                )}
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className='flex-row items-center'>
                    <TouchableOpacity
                        onPress={() => {
                            modalizeShowInfo.current?.open();
                            Keyboard.dismiss();
                        }}
                        className='p-2'
                        disabled={isLoading}
                    >
                        <MaterialIcons name='info-outline' size={28} color={isLoading ? '#cccccc' : '#4B9CFF'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                t('chatbot.delete_history_title'),
                                t('chatbot.delete_history_confirm'),
                                [
                                    { text: t('chatbot.cancel'), style: 'cancel' },
                                    {
                                        text: t('chatbot.delete'),
                                        style: 'destructive',
                                        onPress: () => deleteChatHistory(),
                                    },
                                ],
                                { cancelable: true },
                            );
                            Keyboard.dismiss();
                        }}
                        className='p-2'
                        disabled={isLoading || isFetching || messages.length === 0}
                    >
                        <MaterialIcons
                            name='delete-outline'
                            size={28}
                            color={isLoading || isFetching || messages.length === 0 ? '#cccccc' : '#FF4D4F'}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {Platform.OS === 'ios' ? (
                <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }} keyboardVerticalOffset={60}>
                    <View style={{ flex: 1 }}>
                        {isFetching ? (
                            <View className='flex-1 justify-center items-center'>
                                <ActivityIndicator size='large' color='#4B9CFF' />
                                <Text className='mt-3 text-gray-500'>{t('chatbot.loading_history')}</Text>
                            </View>
                        ) : (
                            renderChatList()
                        )}
                        {isLoading && <TypingIndicator />}
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={inputRef}
                            style={styles.textInput}
                            placeholder={
                                dataMode ? t('chatbot.data_input_placeholder') : t('chatbot.input_placeholder')
                            }
                            value={inputMessage}
                            onChangeText={setInputMessage}
                            placeholderTextColor={'#999999'}
                            selectionColor={'#1479FD'}
                            multiline
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <TouchableOpacity
                            onPress={() => handleSendMessage()}
                            disabled={!inputMessage.trim() || isLoading}
                            style={
                                !!inputMessage.trim() && !isLoading
                                    ? [styles.sendButtonActive, dataMode ? { backgroundColor: '#FF9500' } : {}]
                                    : styles.sendButtonInactive
                            }
                        >
                            {isLoading ? (
                                <ActivityIndicator size='small' color='#FFFFFF' />
                            ) : (
                                <Ionicons name='send' size={18} color='white' />
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        {isFetching ? (
                            <View className='flex-1 justify-center items-center'>
                                <ActivityIndicator size='large' color='#4B9CFF' />
                                <Text className='mt-3 text-gray-500'>{t('chatbot.loading_history')}</Text>
                            </View>
                        ) : (
                            renderChatList()
                        )}
                        {isLoading && <TypingIndicator />}
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={inputRef}
                            style={styles.textInput}
                            placeholder={
                                dataMode ? t('chatbot.data_input_placeholder') : t('chatbot.input_placeholder')
                            }
                            value={inputMessage}
                            onChangeText={setInputMessage}
                            placeholderTextColor={'#999999'}
                            selectionColor={'#1479FD'}
                            multiline
                            autoCapitalize='none'
                            autoCorrect={false}
                        />
                        <TouchableOpacity
                            onPress={() => handleSendMessage()}
                            disabled={!inputMessage.trim() || isLoading}
                            style={
                                !!inputMessage.trim() && !isLoading
                                    ? [styles.sendButtonActive, dataMode ? { backgroundColor: '#FF9500' } : {}]
                                    : styles.sendButtonInactive
                            }
                        >
                            {isLoading ? (
                                <ActivityIndicator size='small' color='#FFFFFF' />
                            ) : (
                                <Ionicons name='send' size={18} color='white' />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <ChatbotIntroModal modalRef={modalizeShowInfo} />
        </SafeAreaView>
    );
};

export default EnhancedChatScreen;
