import clsx from 'clsx';
import React from 'react';
import { Text } from 'react-native';

interface Props extends React.ComponentProps<typeof Text> {
    text: string;
    title?: boolean;
    size?: number;
    color?: string;
    fontBold?: boolean;
}

export default function TextComponent(props: Props) {
    const { text, title, className, size, color, fontBold, ...prop } = props;

    return (
        <Text
            {...prop}
            className={clsx('text-base text-black font-inter', title && 'text-2xl font-interMd ', className)}
            style={[
                {
                    fontSize: title ? 24 : size || 16,
                    color: color || '#000',
                    fontFamily: title ? 'InterMd' : fontBold ? 'InterSemi' : 'Inter',
                },
                prop.style,
            ]}
        >
            {text}
        </Text>
    );
}
