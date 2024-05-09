import {
    ImageBackground,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import React from 'react';
import clsx from 'clsx';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RowComponent from './RowComponent';
import { colors } from '@/constants/colors';
import TextComponent from './TextComponent';

interface Props extends ViewStyle {
    children: React.ReactNode;
    isAuth?: boolean;
    back?: boolean;
    title?: string;
    isScroll?: boolean;
    icon?: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

export default function ContainerComponent(props: Props) {
    const { children, isAuth, back, title, style, isScroll, icon, onPress, ...containerProps } = props;

    const heightBar: number = Platform.OS === 'ios' ? 52 : StatusBar.currentHeight || 52;
    const ViewWrapper = isScroll ? ScrollView : View;
    return isAuth ? (
        <ImageBackground
            source={require('../assets/images/bg-login.png')}
            className='flex-1'
            imageStyle={{
                resizeMode: 'cover',
            }}
        >
            <ViewWrapper {...containerProps} style={{ paddingTop: heightBar }} className='min-h-full'>
                {children}
            </ViewWrapper>
        </ImageBackground>
    ) : (
        <View>
            <View className={`px-4 border-b-[0.2px]`} style={[style]}>
                <RowComponent style={{ justifyContent: 'space-between', paddingTop: heightBar, paddingBottom: 8 }}>
                    {back && (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name='chevron-back' size={24} color={colors['primary-400']} />
                        </TouchableOpacity>
                    )}
                    {title && <TextComponent text={title} title className='text-primary-900' />}
                    {icon && <TouchableOpacity onPress={onPress}>{icon}</TouchableOpacity>}
                </RowComponent>
            </View>
            <ViewWrapper {...containerProps} className='min-h-full'>
                {children}
            </ViewWrapper>
        </View>
    );
}

const styles = StyleSheet.create({});
