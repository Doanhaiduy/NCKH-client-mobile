import { StyleSheet, Text } from 'react-native';
import React from 'react';
import clsx from 'clsx';

interface Props extends React.ComponentProps<typeof Text> {
    text: string;
    title?: boolean;
    size?: number;
    color?: string;
}

export default function TextComponent(props: Props) {
    const { text, title, className, size, color, ...prop } = props;

    return (
        <Text
            {...prop}
            className={clsx('text-base text-black font-inter', title && 'text-2xl font-interMd', className)}
            style={[{ fontSize: size || 16, color: color || '#000' }, prop.style]}
        >
            {text}
        </Text>
    );
}
