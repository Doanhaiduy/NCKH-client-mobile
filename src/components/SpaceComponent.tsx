import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
    width?: number;
    height?: number;
}

export default function SpaceComponent(props: Props) {
    const { width, height } = props;
    return (
        <View
            style={{
                width: width && width,
                height: height && height,
            }}
        />
    );
}

const styles = StyleSheet.create({});
