if (__DEV__) {
    require('../../ReactotronConfig');
}
import store from '@/stores/store';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import { Slot, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, LogBox, Platform, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useDispatch } from 'react-redux';
import '../../global.css';
import { Host } from 'react-native-portalize';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuth } from '@/stores/reducers/authReducer';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Mapbox from '@rnmapbox/maps';

const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_API_KEY!;

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
// Block "react-native-render-html" error log
LogBox.ignoreLogs(['Use JavaScript default parameters instead.']);

// This is the default configuration
configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
});

SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
            refetchOnMount: false,
            refetchOnReconnect: true,
            retry: 3,
            staleTime: 1000 * 60 * 1,
        },
    },
});

export const unstable_settings = {
    initialRouteName: '(tabs)/(home)/index',
};

const FloatingChatIcon: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    // Pulse animation
    useEffect(() => {
        if (pathname === '/') {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
            );
            pulse.start();
            return () => pulse.stop();
        }
    }, [scaleAnim, pathname]);

    if (pathname !== '/') {
        return null;
    }
    const handleOpenChat = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((error) => console.error('Haptic error:', error));
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0, // Thu nhỏ
                friction: 10, // Giảm độ ma sát
                tension: 60, // Tăng độ đàn hồi
                useNativeDriver: true,
            }),
        ]).start(() => {
            router.push('/chat');
        });
    };

    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
                position: 'absolute',
                bottom: Platform.OS === 'ios' ? 100 : 80,
                right: 20,
                zIndex: 1000,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 8,
            }}
        >
            <TouchableOpacity onPress={handleOpenChat} activeOpacity={0.9}>
                <LinearGradient
                    colors={[colors.primary300, colors.primary400]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        borderRadius: 32,
                        width: 64,
                        height: 64,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                    }}
                >
                    <View className='w-12 h-12 rounded-full bg-[#e6f0ff] items-center justify-center'>
                        <Image source={require('@/assets/images/logo_chatbot.png')} style={{ width: 32, height: 32 }} />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Inter: Inter_400Regular,
        InterMd: Inter_500Medium,
        InterSemi: Inter_600SemiBold,
        PoppinsSemi: Poppins_600SemiBold,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <RootLayoutNav />
                </I18nextProvider>
            </Provider>
        </QueryClientProvider>
    );
}

function RootLayoutNav() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const auth = await AsyncStorage.getItem('auth');
                if (auth) {
                    const authData = JSON.parse(auth);
                    dispatch(setAuth(authData));
                }
            } catch (error) {
                console.error('Failed to load auth data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAuthData();
    }, [dispatch]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' />
            </View>
        );
    }

    return (
        <GestureHandlerRootView className='flex-1 bg-white'>
            <Host>
                <Slot />
                <FloatingChatIcon />
            </Host>
        </GestureHandlerRootView>
    );
}
