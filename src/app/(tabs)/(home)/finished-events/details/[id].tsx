import {
    ButtonComponent,
    ContainerComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

export default function Details() {
    const { id, event, eventName } = useLocalSearchParams();

    const [post, setPost] = useState<any>();

    const FetchPost = () => {
        fetch('http://192.168.1.42:3000/api/v1/posts/6691410fddb4640e8d47212d')
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
    console.log('post :', post);

    return (
        <ContainerComponent iconLeft="back" title={eventName?.toString()}>
            {/* <Image source={require('@/assets/images/TFT.jpg')} resizeMode='cover' className='w-full h-[260px]' /> */}
            {/* <SectionComponent className="flex-1 py-2">
                <RowComponent className="justify-between w-full">
                    <RowComponent>
                        <Ionicons name="calendar" size={14} color={colors.black} />
                        <TextComponent text="10/10/2021" className="text-[13px] text-text-400" />
                    </RowComponent>
                    {event === 'Đang diễn ra' && (
                        <ButtonComponent
                            title="Đăng ký"
                            size="small"
                            type="primary"
                            icon={<Ionicons name="add" size={20} color="white" />}
                            iconFlex="left"
                            onPress={() => {}}
                        />
                    )}
                </RowComponent>
                <SpaceComponent height={16} />
                <TextComponent
                    color={colors.primary300}
                    size={20}
                    text="THÔNG BÁO VỀ VIỆC ĐĂNG KÍ THAM GIA GIẢI BÓNG CHUYỀN NAM – NỮ khoa Công nghệ thông tin năm 2024"
                />
                <View className="pt-4 flex-col gap-3">
                    <TextComponent text="Đối tượng tham gia: sinh viên Khoa Công Nghệ Thông Tin" />
                    <TextComponent text="Thể lệ cuộc thi:  Mỗi đoàn Khoa/Viện đăng ký lập 1 đội nam và 01 đội nữ. Mỗi đội gồm 07 sinh viên thi đấu thể thức Sân 5. Lưu ý nếu số lượng đăng kí vượt  quá 7 bạn thì sẽ có 1 buổi tiến hành lựa chọn các bạn để tham gia thi đấu!" />
                    <TextComponent text="Thời gian: từ ngày 10/3/2024 - 17/3/2024." />
                    <TextComponent text="Địa điểm: Nhà thi đấu đa năng, Trường Đại học Nha Trang" />
                    <TextComponent
                        text="Cơ cấu giải thưởng:
                           - 02 giải Nhất (02 giải x 1.000.000đ/giải)
                            - 02 giải Nhì (02 giải x 700.000đ/giải)
                            - 04 giải Ba (04 giải x 500.000đ/giải)"
                    />
                </View>
            </SectionComponent> */}
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
                    <img src="https://cdn.tgdd.vn/Files/2022/03/06/1418798/so2-100423-010123.jpg" />
                    <div class="time">
                        <span>10/10/2021</span>
                        <button>Đăng ký</button>
                    </div>
                    <div class="container">${post}</div>
                    </body></html>`,
                }}
            />
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
