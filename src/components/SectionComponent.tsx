import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import clsx from 'clsx';

interface Props extends React.ComponentProps<typeof View> {
    children: React.ReactNode;
    align?: 'center' | 'left' | 'right';
}

export default function SectionComponent(props: Props) {
    const { children, align, ...sectionProps } = props;

    return (
        <View
            {...sectionProps}
            className={clsx(
                'px-4 pb-5 items-start ',
                align === 'center' && 'items-center',
                align === 'left' && 'items-start',
                align === 'right' && 'items-end'
            )}
            style={sectionProps.style}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({});
