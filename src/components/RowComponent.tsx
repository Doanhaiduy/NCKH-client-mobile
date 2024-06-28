import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface Props extends React.ComponentProps<typeof View> {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export default function RowComponent(props: Props) {
    const { children, style, ...rowProps } = props;
    return (
        <View className="flex flex-row items-center" style={style} {...rowProps}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({});
