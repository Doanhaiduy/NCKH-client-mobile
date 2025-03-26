import authAPI from '@/apis/authApi';
import { ContainerComponent, SectionComponent, TextComponent } from '@/components';
import ImageComponent from '@/components/ImageComponent';
import { colors } from '@/constants/colors';
import { authSelector, logout } from '@/stores/reducers/authReducer';
import { Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function SettingPage() {
    const { t } = useTranslation();
    const { authData } = useSelector(authSelector);

    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const res = await authAPI.logout();
            dispatch(logout());
            router.navigate('/sign-in');
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <ContainerComponent isScroll title={t('settings.title')} iconLeft='logo' notification>
            <SectionComponent className='flex-row flex-1 items-center mt-4'>
                <View
                    className='border-1 border border-primary-400 p-[2px]'
                    style={{
                        borderRadius: 99,
                    }}
                >
                    <ImageComponent showImageModal url={authData?.avatar!} height={80} width={80} rounded={99} />
                </View>
                <View className='ml-4 flex-1'>
                    <TextComponent text={authData?.fullName || ''} className='text-xl' />
                    <TextComponent
                        text={t('settings.student_id_label').replace('{username}', authData?.username || '')}
                        className='text-base text-gray-400'
                    />
                </View>
                <TouchableOpacity onPress={() => router.push('setting/profile')}>
                    <Feather name='info' size={24} color={colors.primary500} />
                </TouchableOpacity>
            </SectionComponent>

            <SectionComponent className='mt-4'>
                <TouchableOpacity
                    className='flex-row flex-1 w-full items-center py-6 border-y-[1px] border-y-text-200'
                    onPress={() => router.push('setting/language')}
                >
                    <Ionicons name='earth-outline' size={26} color={colors.primary400} />
                    <TextComponent text={t('settings.language')} className='text-base ml-4 flex-1' />
                    <Ionicons name='chevron-forward' size={26} color={colors.text500} />
                </TouchableOpacity>
                <TouchableOpacity
                    className='flex-row flex-1 w-full items-center py-6 border-b-[1px] border-b-text-200'
                    onPress={() => router.push('setting/change-password')}
                >
                    <Entypo name='lock' size={26} color={colors.primary400} />
                    <TextComponent text={t('settings.change_password')} className='text-base ml-4 flex-1' />
                    <Ionicons name='chevron-forward' size={26} color={colors.text500} />
                </TouchableOpacity>
                <TouchableOpacity
                    className='flex-row flex-1 w-full items-center py-6 border-b-[1px] border-b-text-200'
                    onPress={() => router.push('setting/helps')}
                >
                    <Feather name='info' size={26} color={colors.primary400} />
                    <TextComponent text={t('settings.help')} className='text-base ml-4 flex-1' />
                    <Ionicons name='chevron-forward' size={26} color={colors.text500} />
                </TouchableOpacity>
                <TouchableOpacity
                    className='flex-row flex-1 w-full items-center py-6 border-b-[1px] border-b-text-200'
                    onPress={() => {
                        Alert.alert(t('settings.logout_alert_title'), t('settings.logout_alert_message'), [
                            {
                                text: t('settings.cancel_button'),
                                style: 'cancel',
                            },
                            {
                                text: t('settings.agree_button'),
                                onPress: () => handleLogout(),
                            },
                        ]);
                    }}
                >
                    <FontAwesome name='sign-out' size={26} color={colors.primary400} />
                    <TextComponent text={t('settings.logout')} className='text-base ml-4 flex-1' />
                </TouchableOpacity>
            </SectionComponent>
        </ContainerComponent>
    );
}
