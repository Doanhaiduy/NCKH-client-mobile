import { StyleSheet, Text } from 'react-native';
import React from 'react';
import clsx from 'clsx';

interface Props extends React.ComponentProps<typeof Text> {
    text: string;
    title?: boolean;
}

export default function TextComponent(props: Props) {
    const { text, title, className, ...prop } = props;

    return (
        <Text
            {...prop}
            className={clsx('text-base text-black font-inter', title && 'text-2xl font-interMd', className)}
        >
            {text}
        </Text>
    );
}
