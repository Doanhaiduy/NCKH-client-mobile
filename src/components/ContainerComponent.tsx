import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { ReactNode, useEffect } from 'react';
import {
    ImageBackground,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import RowComponent from './RowComponent';
import SectionComponent from './SectionComponent';
import TextComponent from './TextComponent';
import SpaceComponent from './SpaceComponent';
import { appInfo } from '@/constants/appInfo';

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
    search?: boolean;
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
        search,
        _refreshing,
        onBack,
        isHome,
        ...containerProps
    } = props;

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        handleRefresh && handleRefresh();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const heightBar: number = !isModal ? (Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 30) : 22;
    const ViewWrapper = isScroll ? ScrollView : View;
    const HeaderAuth = (
        <ViewWrapper style={{ paddingTop: iconLeft === 'back' || title ? 0 : heightBar }} className="flex-1">
            {children}
            <SectionComponent
                align="center"
                className="pb-12 w-full"
                style={{
                    marginTop: iconLeft === 'back' || title ? 170 : 118,
                }}
            >
                <SpaceComponent height={10} />
                <RowComponent>
                    <TextComponent text="Tiếng việt" className="text-center" />
                    <Ionicons name="chevron-down" size={24} color={colors.black} />
                </RowComponent>
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
                        borderBottomWidth: isHome ? 0 : 0.6,
                        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
                        maxWidth: appInfo.sizes.WIDTH,
                    },
                ]}
            >
                <RowComponent
                    style={{
                        justifyContent: 'space-between',
                        // paddingTop: heightBar,
                        paddingTop: 20,
                        paddingBottom: 8,
                    }}
                >
                    {iconLeft === 'back' && (
                        <TouchableOpacity onPress={() => (onBack ? onBack() : router.back())}>
                            <Ionicons name="chevron-back" size={24} color={colors['primary400']} />
                        </TouchableOpacity>
                    )}
                    {iconLeft === 'logo' && (
                        <TouchableOpacity onPress={() => {}}>
                            <Ionicons name="logo-react" size={24} color={colors['primary400']} />
                        </TouchableOpacity>
                    )}
                    {title && (
                        <TextComponent
                            text={title}
                            title
                            center
                            style={{
                                fontSize: isHome ? 32 : 24,
                                lineHeight: isHome ? 40 : 32,
                            }}
                        />
                    )}
                    {search ? (
                        <TouchableOpacity onPress={() => router.push('/search')}>
                            <Ionicons name="search" size={26} color={colors['primary400']} />
                        </TouchableOpacity>
                    ) : iconRight ? null : (
                        <Ionicons name="search" size={26} color="transparent" />
                    )}
                    {iconRight && iconRight}
                </RowComponent>
            </View>
        );
    };

    return isAuth ? (
        <ImageBackground
            source={require('../assets/images/bg-login.png')}
            className="flex-1 bg-primary-100"
            imageStyle={{
                resizeMode: 'cover',
                flex: 1,
            }}
        >
            {iconLeft === 'back' && (
                <RowComponent style={{ paddingTop: heightBar, paddingBottom: 8, paddingLeft: 16 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={35} color={'#444'} />
                    </TouchableOpacity>
                </RowComponent>
            )}
            {HeaderAuth}
        </ImageBackground>
    ) : (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle={'dark-content'} />
            <HeaderMain />
            <ViewWrapper
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    Platform.OS === 'android' ? (
                        <RefreshControl refreshing={_refreshing === undefined && refreshing} onRefresh={onRefresh} />
                    ) : (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            size={20}
                            tintColor={colors['primary400']}
                        />
                    )
                }
                className="flex-1"
            >
                {children}
            </ViewWrapper>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
