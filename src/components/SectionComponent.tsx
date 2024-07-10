import clsx from 'clsx';
import React from 'react';
import { StyleSheet, View } from 'react-native';

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
                'px-4 pb-5 items-start w-full',
                align === 'center' && 'items-center',
                align === 'left' && 'items-start',
                align === 'right' && 'items-end',
            )}
            style={sectionProps.style}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({});
