import React, { useEffect, useRef } from 'react';
import { View, Animated, Image } from 'react-native';

const TypingIndicator: React.FC = () => {
    // Create Animated.Value for each dot
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Function to create animation for a dot
        const createBounce = (dot: Animated.Value) =>
            Animated.loop(
                Animated.sequence([
                    Animated.timing(dot, {
                        toValue: -10, // Move up
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0, // Return to original position
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
            );

        // Create animations with different delays
        const bounce1 = createBounce(dot1);
        const bounce2 = createBounce(dot2);
        const bounce3 = createBounce(dot3);

        // Start animations with delay
        bounce1.start();
        setTimeout(() => bounce2.start(), 200);
        setTimeout(() => bounce3.start(), 400);

        // Cleanup when component unmounts
        return () => {
            bounce1.stop();
            bounce2.stop();
            bounce3.stop();
        };
    }, [dot1, dot2, dot3]);

    return (
        <View className='flex-row ml-6 mb-3'>
            <View className='w-10 h-10 rounded-full bg-primary-100 mr-2 items-center justify-center'>
                <Image
                    source={require('@/assets/images/logo_chatbot.png')}
                    style={{ width: 30, height: 30 }}
                    resizeMode='contain'
                />
            </View>
            <View className='p-3 bg-gray-100 rounded-2xl rounded-tl-none shadow-sm'>
                <View className='flex-row items-center'>
                    <Animated.View
                        className='w-2 h-2 bg-primary-300 rounded-full mr-1'
                        style={{ transform: [{ translateY: dot1 }] }}
                    />
                    <Animated.View
                        className='w-2 h-2 bg-primary-300 rounded-full mx-1'
                        style={{ transform: [{ translateY: dot2 }] }}
                    />
                    <Animated.View
                        className='w-2 h-2 bg-primary-300 rounded-full ml-1'
                        style={{ transform: [{ translateY: dot3 }] }}
                    />
                </View>
            </View>
        </View>
    );
};

export default TypingIndicator;
