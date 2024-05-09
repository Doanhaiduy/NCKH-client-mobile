import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

interface Props extends React.ComponentProps<typeof View> {
    children: React.ReactNode;
}

export default function SectionComponent(props: Props) {
    const { children, ...sectionProps } = props;

    return (
        <View {...sectionProps} className='px-4 pb-5'>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({});
