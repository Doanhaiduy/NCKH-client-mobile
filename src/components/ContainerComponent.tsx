import { colors } from '@/constants/colors';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import {
    Image,
    ImageBackground,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleProp,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import RowComponent from './RowComponent';
import SectionComponent from './SectionComponent';
import TextComponent from './TextComponent';
import SpaceComponent from './SpaceComponent';
import { appInfo } from '@/constants/appInfo';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { LanguageSelector } from './LanguageSelectorComponent';

interface Props extends React.ComponentProps<typeof View> {
    children: React.ReactNode;
    isAuth?: boolean;
    iconLeft?: 'back' | 'logo';
    title?: string;
    isScroll?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    isModal?: boolean;
    handleRefresh?: () => void;
    notification?: boolean;
    iconRight?: ReactNode;
    _refreshing?: boolean;
    onBack?: () => void;
    isHome?: boolean;
}

export default function ContainerComponent(props: Props) {
    const {
        children,
        isAuth,
        title,
        style,
        isScroll,
        onPress,
        isModal,
        iconLeft,
        handleRefresh,
        iconRight,
        notification,
        _refreshing,
        onBack,
        isHome,
        ...containerProps
    } = props;

    const router = useCustomRouter();

    const heightBar: number = !isModal ? (Platform.OS === 'ios' ? 50 : appInfo.StatusBarHeight || 30) : 22;
    const ViewWrapper = isScroll ? ScrollView : View;
    const HeaderAuth = (
        <ViewWrapper
            keyboardShouldPersistTaps='handled'
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
                <SpaceComponent height={10} />
                <LanguageSelector />
            </SectionComponent>
        </ViewWrapper>
    );

    const HeaderMain = () => {
        return (
            <View
                className={`px-4`}
                style={[
                    style,
                    {
                        borderBottomWidth: 0.6,
                        paddingTop: Platform.OS === 'android' ? appInfo.StatusBarHeight : 0,
                        maxWidth: appInfo.sizes.WIDTH,
                    },
                ]}
            >
                <RowComponent
                    style={{
                        justifyContent: 'space-between',
                        paddingTop: 20,
                        paddingBottom: 8,
                    }}
                >
                    {isHome ? null : (
                        <View className='w-[10%]'>
                            {iconLeft === 'back' && (
                                <TouchableOpacity onPress={() => (onBack ? onBack() : router.back())} className=''>
                                    <Ionicons name='chevron-back' size={24} color={colors.primary500} />
                                </TouchableOpacity>
                            )}
                            {iconLeft === 'logo' && (
                                <TouchableOpacity onPress={() => {}}>
                                    <Image
                                        source={require('../assets/images/icon.png')}
                                        width={28}
                                        height={28}
                                        resizeMode='cover'
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    <View className={`${!isHome && 'w-[80%]'}`}>
                        {title && (
                            <TextComponent
                                numberOfLines={1}
                                text={title}
                                title={!isHome}
                                center
                                style={{
                                    fontSize: isHome ? 28 : 24,
                                    lineHeight: isHome ? 40 : 32,
                                    color: colors['primary400'],
                                    fontWeight: isHome ? 'bold' : 'normal',
                                }}
                            />
                        )}
                    </View>
                    <View className='w-[10%] items-end'>
                        {notification ? (
                            <TouchableOpacity onPress={() => router.navigate('/notification')} className='px-1'>
                                <Feather name='bell' size={26} color={colors.primary500} />
                            </TouchableOpacity>
                        ) : iconRight ? null : (
                            <View className=''>
                                <Ionicons name='chevron-back' size={24} color='transparent' />
                            </View>
                        )}
                        {iconRight && iconRight}
                    </View>
                </RowComponent>
            </View>
        );
    };

    return isAuth ? (
        <ImageBackground
            {...containerProps}
            source={require('../assets/images/bg-login.png')}
            className='flex-1 bg-primary-100'
            imageStyle={{
                resizeMode: 'cover',
                flex: 1,
            }}
        >
            <StatusBar barStyle='light-content' translucent backgroundColor='transparent' />

            {iconLeft === 'back' && (
                <RowComponent style={{ paddingTop: heightBar, paddingBottom: 8, paddingLeft: 16 }}>
                    <TouchableOpacity onPress={() => (onBack ? onBack() : router.back())}>
                        <Ionicons name='chevron-back' size={35} color={colors.text200} />
                    </TouchableOpacity>
                </RowComponent>
            )}
            {HeaderAuth}
        </ImageBackground>
    ) : (
        <SafeAreaView className='flex-1 bg-white' {...containerProps}>
            <StatusBar barStyle='dark-content' translucent backgroundColor='transparent' />
            <HeaderMain />
            <ViewWrapper
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
                refreshControl={
                    Platform.OS === 'android'
                        ? handleRefresh && <RefreshControl refreshing={_refreshing!} onRefresh={handleRefresh} />
                        : handleRefresh && (
                              <RefreshControl
                                  refreshing={_refreshing!}
                                  onRefresh={handleRefresh}
                                  size={20}
                                  tintColor={colors['primary400']}
                              />
                          )
                }
                className='flex-1'
            >
                {children}
            </ViewWrapper>
        </SafeAreaView>
    );
}
