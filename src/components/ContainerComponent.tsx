import {
    ImageBackground,
    Platform,
    RefreshControl,
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
import React, { ReactNode } from 'react';
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
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    isModal?: boolean;
    handleRefresh?: () => void;
    search?: boolean;
    iconRight?: ReactNode;
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
        ...containerProps
    } = props;

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            handleRefresh && handleRefresh();
            setRefreshing(false);
        }, 1000);
    };

    const heightBar: number = !isModal ? (Platform.OS === 'ios' ? 52 : StatusBar.currentHeight || 52) : 22;
    const ViewWrapper = isScroll ? ScrollView : View;

    const navigation = useNavigation();

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
                <RowComponent>
                    <TextComponent text="Tiếng việt" className="text-center" />
                    <Ionicons name="chevron-down" size={24} color={colors['text800']} />
                </RowComponent>
            </SectionComponent>
        </ViewWrapper>
    );

    const HeaderMain = () => {
        return (
            <View className={`px-4 border-b-[0.2px]`} style={[style]}>
                <RowComponent style={{ justifyContent: 'space-between', paddingTop: heightBar, paddingBottom: 8 }}>
                    {iconLeft === 'back' && (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color={colors['primary400']} />
                        </TouchableOpacity>
                    )}
                    {iconLeft === 'menu' && (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.dispatch(DrawerActions.toggleDrawer());
                            }}
                        >
                            <Ionicons name="menu" size={24} color={colors['primary400']} />
                        </TouchableOpacity>
                    )}
                    {title && <TextComponent text={title} title />}
                    {search ? (
                        <TouchableOpacity>
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
            className="flex-1 bg-[#EDEDFA]"
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
        <View className="flex-1 bg-white">
            <HeaderMain />
            <ViewWrapper
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    Platform.OS === 'android' ? (
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
        </View>
    );
}

const styles = StyleSheet.create({});
