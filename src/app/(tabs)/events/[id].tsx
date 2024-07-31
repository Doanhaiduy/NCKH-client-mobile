import postAPI from '@/apis/postApi';
import {
    ButtonComponent,
    ContainerComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { dateFormat } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

export default function Details({ navigation, route, options }: { navigation: any; route: any; options: any }) {
    const { id, event, eventName } = useLocalSearchParams();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['posts', id],
        queryFn: () => postAPI.getDetailPost(id?.toString() || ''),
    });

    return (
        <ContainerComponent iconLeft="back" title={'Sự kiện'}>
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <WebView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                    }}
                    originWhitelist={['*']}
                    source={{
                        html: `<html><head><meta name="viewport" content="width=device-width" initial-scale="1.00" maximum-scale="1.0">
                        <style>
                            body {
                                font-family: 'Inter', sans-serif;
                                font-size: 14px;
                                padding: 0;
                                margin: 0;
                                box-sizing: border-box;
                            }
                            img {
                                width: 100%;
                                height: auto;
                            }

                            .container{
                                padding: 16px;
                            }

                            .time{
                                font-size: 12px;
                                display: flex; items: center;
                                padding: 16px;
                                justify-content: space-between;
                            }

                            button{
                                background-color: ${colors.primary400};
                                color: #fff;
                                padding: 8px 16px;
                                border-radius: 30px;
                                margin-left: 16px;
                            }
                        </style>
                    </head><body>
                    <img src="${data?.thumbnail}" />
                    <div class="time">
                        <span>${data?.createdAt && dateFormat(data?.createdAt)}</span>
                        <button>Đăng ký</button>
                    </div>
                    <div class="container">${data?.content}</div>
                    </body></html>`,
                    }}
                />
            )}
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
