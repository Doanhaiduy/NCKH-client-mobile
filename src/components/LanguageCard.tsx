import { colors } from '@/constants/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';

interface Props {
    active?: boolean;
    onPress?: (val: string) => void;
    text: string;
    icon?: any;
    lang: string;
}

export default function LanguageCard(props: Props) {
    const { active, onPress, text, icon, lang } = props;

    const containerClasses = clsx(
        'flex-row justify-between w-full px-4 py-[10px] rounded-[10px] border-[1px] mb-2 items-center',
        {
            'border-primary-400': active,
        },
    );

    return (
        <TouchableOpacity onPress={() => onPress?.(lang ?? 'vi')} className={containerClasses}>
            <RowComponent>
                <Image source={icon} className="h-9 w-9 rounded-full" resizeMode="cover" />
                <TextComponent text={text} className="ml-[6px]" size={16} />
            </RowComponent>
            {active ? (
                <FontAwesome5 name="check-circle" size={24} color={colors.primary400} />
            ) : (
                <FontAwesome5 name="circle" size={24} color={colors.text500} />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({});
