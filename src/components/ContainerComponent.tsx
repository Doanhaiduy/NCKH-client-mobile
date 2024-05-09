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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RowComponent from './RowComponent';
import { colors } from '@/constants/colors';
import TextComponent from './TextComponent';

interface Props extends React.ComponentProps<typeof View> {
    children: React.ReactNode;
    isAuth?: boolean;
    back?: boolean;
    title?: string;
    isScroll?: boolean;
    icon?: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    isModal?: boolean;
}

export default function ContainerComponent(props: Props) {
    const { children, isAuth, back, title, style, isScroll, icon, onPress, isModal, ...containerProps } = props;

    const heightBar: number = !isModal ? (Platform.OS === 'ios' ? 52 : StatusBar.currentHeight || 52) : 0;
    const ViewWrapper = isScroll ? ScrollView : SafeAreaView;

    return isAuth ? (
        <ImageBackground
            source={require('../assets/images/bg-login.png')}
            className='flex-1 bg-[#EDEDFA]'
            imageStyle={{
                resizeMode: 'cover',
                flex: 1,
            }}
        >
            {isModal && (
                <RowComponent style={{ paddingTop: 12, paddingBottom: 8 }}>
                    {back && (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name='chevron-back' size={35} color={colors['black']} />
                        </TouchableOpacity>
                    )}
                </RowComponent>
            )}
            <ViewWrapper {...containerProps} style={{ paddingTop: heightBar }} className='min-h-full flex-1'>
                {children}
            </ViewWrapper>
        </ImageBackground>
    ) : (
        <View className='flex-1'>
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
            <ViewWrapper {...containerProps} className='min-h-full flex-1'>
                {children}
            </ViewWrapper>
        </View>
    );
}

const styles = StyleSheet.create({});
