import clsx from 'clsx';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import TextComponent from './TextComponent';
import { colors } from '@/constants/colors';

interface Props extends React.ComponentProps<typeof View> {
    children: React.ReactNode;
    align?: 'center' | 'left' | 'right';
    title?: string;
    titleCenter?: boolean;
}

export default function SectionComponent(props: Props) {
    const { children, align, title, titleCenter, ...sectionProps } = props;

    return (
        <View
            {...sectionProps}
            className={clsx(
                'px-4 pb-5 items-start w-full',
                align === 'center' && 'items-center',
                align === 'left' && 'items-start',
                align === 'right' && 'items-end',
            )}
            style={sectionProps.style}
        >
            {title && (
                <TextComponent
                    text={title || ''}
                    size={20}
                    className={`font-interSemi my-4 ${titleCenter ? 'mx-auto' : ''}`}
                    color={colors.primary400}
                />
            )}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({});
