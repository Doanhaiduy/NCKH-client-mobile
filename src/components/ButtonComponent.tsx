import clsx from 'clsx';
import React from 'react';
import { Button, StyleSheet, TouchableOpacity, View } from 'react-native';
import TextComponent from './TextComponent';

interface Props extends React.ComponentProps<typeof Button> {
    title: string;
    type: 'primary' | 'outline' | 'grey';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    onPress: () => void;
    icon?: React.ReactNode;
    iconFlex?: 'left' | 'right';
}

const variantContainer = {
    default: 'rounded-[30px] shadow-md flex flex-row items-center justify-center min-h-[48px]',
    primary: 'bg-primary-400',
    outline: 'bg-white border-[1px] border-primary-400',
    grey: 'bg-text-400',
};

const variantText = {
    default: 'text-white',
    primary: 'text-white',
    outline: 'text-primary-400',
    grey: 'text-white',
};

export default function ButtonComponent(props: Props) {
    const { title, type, size, disabled, onPress, icon, iconFlex } = props;

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            className={clsx(variantContainer.default, variantContainer[type], {
                'w-full min-h-[48px]': size === 'large',
                'max-w-[168px] min-h-[38px] px-8': size === 'medium',
                'max-w-[115px] min-h-[32px] px-5': size === 'small',
                'opacity-70': disabled,
            })}
        >
            <>
                {icon && iconFlex !== 'right' && <View className="mr-[2px]">{icon}</View>}
                <TextComponent
                    text={title}
                    className={clsx(variantText.default, variantText[type], {
                        'text-[13px]': size === 'small',
                        'text-base': size === 'medium',
                        'opacity-70': disabled,
                    })}
                />
                {icon && iconFlex === 'right' && <View className="">{icon}</View>}
            </>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({});
