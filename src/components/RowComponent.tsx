import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React, { Children } from 'react';

interface Props {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export default function RowComponent(props: Props) {
    const { children, style } = props;
    return (
        <View className="flex flex-row items-center" style={style}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({});
