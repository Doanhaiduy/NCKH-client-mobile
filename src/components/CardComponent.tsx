import { globalStyles } from '@/styles';
import clsx from 'clsx';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props extends React.ComponentProps<typeof TouchableOpacity> {
    children: React.ReactNode;
    onPress?: () => void;
    isShadow?: boolean;
}

export default function CardComponent(props: Props) {
    const { children, onPress, isShadow, ...cardProps } = props;
    const containerClass = clsx('rounded-[10px] w-full pb-[10px] mb-4 bg-white self-start');

    return onPress ? (
        <TouchableOpacity
            onPress={onPress}
            style={[isShadow && globalStyles.shadow, cardProps.style && cardProps.style]}
            className={containerClass}
        >
            {children}
        </TouchableOpacity>
    ) : (
        <View style={[isShadow && globalStyles.shadow, cardProps.style && cardProps.style]} className={containerClass}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({});
