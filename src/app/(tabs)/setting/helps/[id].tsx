import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
    CollapsibleGuideComponent,
    ContainerComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { useTranslation } from 'react-i18next';
import { attendanceGuide, passwordResetGuide, registerActivityGuide, trainingPointGuide } from '@/mockData';

type GuideType = 'attendance' | 'registerActivity' | 'trainingPoint' | 'passwordReset';

const ObjectGuide = {
    attendance: attendanceGuide,
    registerActivity: registerActivityGuide,
    trainingPoint: trainingPointGuide,
    passwordReset: passwordResetGuide,
};

const DetailsUserGuid = () => {
    const { t } = useTranslation();
    const { id, title, type } = useLocalSearchParams();
    console.log('id', title, type);

    return (
        <ContainerComponent iconLeft='back' title={t('user_guide.title')} notification isScroll>
            <SectionComponent className='flex-1'>
                <View style={styles.header}>
                    <TextComponent text={title.toString()} color={colors.primary400} size={20} fontBold />
                </View>
                <View className='py-4'>
                    <TextComponent text={t('user_guide.functionality_title')} color={colors.black} size={18} fontBold />
                    <SpaceComponent height={8} />
                    <CollapsibleGuideComponent sections={ObjectGuide[type.toString() as GuideType] || []} />
                </View>
            </SectionComponent>
        </ContainerComponent>
    );
};

export default DetailsUserGuid;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: colors.text200,
        width: '100%',
    },
});
