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
import SectionComponent from './SectionComponent';
import { DrawerActions, useNavigation } from '@react-navigation/native';

interface Props extends React.ComponentProps<typeof View> {
    children: React.ReactNode;
    isAuth?: boolean;
    iconLeft?: 'back' | 'menu';
    title?: string;
    isScroll?: boolean;
    iconRight?: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    isModal?: boolean;
}

export default function ContainerComponent(props: Props) {
    const { children, isAuth, title, style, isScroll, iconRight, onPress, isModal, iconLeft, ...containerProps } =
        props;

    const heightBar: number = !isModal ? (Platform.OS === 'ios' ? 52 : StatusBar.currentHeight || 52) : 0;
    const ViewWrapper = isScroll ? ScrollView : View;

    const navigation = useNavigation();

    return isAuth ? (
        <ImageBackground
            source={require('../assets/images/bg-login.png')}
            className='flex-1 bg-[#EDEDFA]'
            imageStyle={{
                resizeMode: 'cover',
                flex: 1,
            }}
        >
            {iconLeft === 'back' && (
                <RowComponent style={{ paddingTop: heightBar, paddingBottom: 8 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name='chevron-back' size={35} color={colors['white']} />
                    </TouchableOpacity>
                </RowComponent>
            )}

            <ViewWrapper
                {...containerProps}
                style={{ paddingTop: iconLeft === 'back' || title ? 0 : heightBar }}
                className='flex-1'
            >
                {children}
                <SectionComponent
                    align='center'
                    className='pb-12 w-full'
                    style={{
                        marginTop: iconLeft === 'back' || title ? 170 : 118,
                    }}
                >
                    <RowComponent>
                        <TextComponent text='Tiếng việt' className='text-center' />
                        <Ionicons name='chevron-down' size={24} color={colors['text-800']} />
                    </RowComponent>
                </SectionComponent>
            </ViewWrapper>
        </ImageBackground>
    ) : (
        <View className='flex-1'>
            <View className={`px-4 border-b-[0.2px]`} style={[style]}>
                <RowComponent style={{ justifyContent: 'space-between', paddingTop: heightBar, paddingBottom: 8 }}>
                    {iconLeft === 'back' && (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name='chevron-back' size={24} color={colors['primary-400']} />
                        </TouchableOpacity>
                    )}
                    {iconLeft === 'menu' && (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.dispatch(DrawerActions.toggleDrawer());
                            }}
                        >
                            <Ionicons name='menu' size={24} color={colors['primary-400']} />
                        </TouchableOpacity>
                    )}
                    {title && <TextComponent text={title} title className='text-primary-900' />}
                    {iconRight && <TouchableOpacity onPress={onPress}>{iconRight}</TouchableOpacity>}
                </RowComponent>
            </View>
            <ViewWrapper {...containerProps} className='flex-1'>
                {children}
            </ViewWrapper>
        </View>
    );
}

const styles = StyleSheet.create({});
