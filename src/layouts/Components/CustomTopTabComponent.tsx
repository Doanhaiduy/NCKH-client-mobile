import { Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { RowComponent, SectionComponent, TextComponent } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import CategoriesList from './CategoriesList';
import Animated, { ReduceMotion, SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useHeaderHeight } from '@/contexts/HeaderHeightContext';
import { appInfo } from '@/constants/appInfo';
import { useSelector } from 'react-redux';
import { authSelector } from '@/stores/reducers/authReducer';

export default function CustomTopTabComponent({
    navigation,
    route,
    options,
}: {
    navigation: any;
    route: any;
    options: any;
}) {
    const heightBar: number = Platform.OS === 'ios' ? 52 : StatusBar.currentHeight || 52;
    const { headerHeight } = useHeaderHeight();
    const { authData } = useSelector(authSelector);
    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(headerHeight, {
                reduceMotion: ReduceMotion.Never,
            }),
        };
    });

    const animatedCategoriesListStyle = useAnimatedStyle(() => {
        return {
            display: headerHeight === appInfo.headerHeight.onScroll ? 'none' : 'flex',
        };
    });

    return route.name !== 'training-point'
        ? // <View className='bg-white '>
          //     <Animated.View style={[animatedContainerStyle]}>
          //         <LinearGradient
          //             start={[0.0, 0.5]}
          //             end={[1.0, 0.5]}
          //             locations={[0.0, 1.0]}
          //             colors={['#0500FF', '#030099']}
          //             style={{
          //                 flex: 1,
          //                 // borderBottomLeftRadius: headerHeight === appInfo.headerHeight.onScroll ? 0 : 30,
          //                 // borderBottomRightRadius: headerHeight === appInfo.headerHeight.onScroll ? 0 : 30,
          //                 borderBottomLeftRadius: 30,
          //                 borderBottomRightRadius: 30,
          //                 paddingTop: heightBar,
          //                 paddingBottom: 0,
          //                 justifyContent: 'space-between',
          //                 backgroundColor: colors.white,
          //             }}
          //         >
          //             <StatusBar barStyle='light-content' />
          //             <SectionComponent>
          //                 <RowComponent className='justify-between w-full'>
          //                     <TouchableOpacity>
          //                         <Ionicons name='logo-react' size={24} color={colors.white} />
          //                     </TouchableOpacity>
          //                     <TextComponent text='Trang chủ' title color={colors.white} />
          //                     <TouchableOpacity onPress={() => router.push('/search')}>
          //                         <Ionicons name='search' size={26} color={colors.white} />
          //                     </TouchableOpacity>
          //                 </RowComponent>
          //                 {/* <Animated.View className='mt-8' style={animatedCategoriesListStyle}>
          //                     <SectionComponent className='flex-row justify-between items-center space-x-4 '>
          //                         <RowComponent className='p-2 h-16 flex-1 space-x-2 bg-white rounded-[12px] w-full'>
          //                             <View>
          //                                 <Image
          //                                     source={{
          //                                         uri: authData?.avatar,
          //                                     }}
          //                                     className='h-full aspect-square rounded-[12px]'
          //                                     resizeMode='cover'
          //                                 />
          //                             </View>
          //                             <View className='w-2/3'>
          //                                 <TextComponent text='Xin chào,' size={13} />
          //                                 <TextComponent
          //                                     text={authData?.fullName!}
          //                                     size={14}
          //                                     fontBold
          //                                     className='break-words leading-4'
          //                                 />
          //                             </View>
          //                         </RowComponent>
          //                         <RowComponent className='p-2 h-16 flex-1 space-x-2 bg-white rounded-[12px]'>
          //                             <View>
          //                                 <Image
          //                                     source={require('@/assets/images/logo-login.png')}
          //                                     className='h-full aspect-square rounded-[12px]'
          //                                     resizeMode='cover'
          //                                 />
          //                             </View>
          //                             <View>
          //                                 <TextComponent text='MSSV' size={13} />
          //                                 <TextComponent
          //                                     text={authData?.username!}
          //                                     size={14}
          //                                     fontBold
          //                                     className='max-w-[90%] min-w-[90%] break-words leading-4'
          //                                 />
          //                             </View>
          //                         </RowComponent>
          //                     </SectionComponent>
          //                 </Animated.View> */}
          //             </SectionComponent>
          //         </LinearGradient>
          //     </Animated.View>
          // </View>
          null
        : null;
}

const styles = StyleSheet.create({});
