import { ContainerComponent } from '@/components';
import { appInfo } from '@/constants/appInfo';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import WebView from 'react-native-webview';

export default function SearchPage() {
    const [post, setPost] = useState<any>();

    const FetchPost = () => {
        fetch('http://192.168.1.4:3000/api/v1/posts/6691410fddb4640e8d47212d')
            .then((response) => response.text())
            .then((result) => {
                if (result) {
                    const data = JSON.parse(result).data;
                    setPost(data.content);
                }
            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        FetchPost();
    }, []);

    return (
        // <ContainerComponent
        //     isScroll
        //     title='Tìm kiếm'
        //     iconLeft='back'
        //     style={{
        //         marginTop: appInfo.headerHomeBar,
        //     }}
        // >

        // </ContainerComponent>
        <View
            className="flex-1"
            style={{
                marginTop: appInfo.headerHomeBar,
            }}
        >
            <WebView
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                }}
                originWhitelist={['*']}
                source={{ html: post }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});
