import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import postAPI from '@/apis/postApi';
import RenderHtml from 'react-native-render-html';
import { appInfo } from '@/constants/appInfo';
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
import { dateFormat } from '@/utils/dateTime';
import ImageComponent from '@/components/ImageComponent';

type Props = {};

const DetailsScreen = (props: Props) => {
    const { id } = useLocalSearchParams();
    const [content, setContent] = React.useState<string>('');

    const { data, isFetching, refetch } = useQuery<Post>({
        queryKey: ['post-details', id],
        queryFn: () => postAPI.getDetailPost(id!.toString()),
    });

    useEffect(() => {
        if (data) {
            setContent(data.content || '');
        }
    }, [data]);

    console.log(data);
    return (
        <ContainerComponent
            title={`Tin tức`}
            iconLeft="back"
            notification
            isScroll
            _refreshing={isFetching}
            handleRefresh={refetch}
        >
            <ImageComponent url={data?.thumbnail!} imageClass="w-full" aspectRatio={16 / 9} />
            <SectionComponent>
                <View className="flex-row justify-between mt-3 w-full">
                    <RowComponent className="">
                        <Ionicons name="calendar" size={14} color={colors.black} />
                        <TextComponent
                            text={dateFormat(data?.createdAt || '')}
                            className="ml-1 text-[13px] text-text-400"
                        />
                    </RowComponent>
                    <View className="flex-row items-center">
                        <Pressable>
                            <Ionicons name="share-social" size={24} color={colors.primary500} />
                        </Pressable>
                        <SpaceComponent width={12} />
                        <ButtonComponent
                            onPress={() => {}}
                            title="Đăng ký"
                            type="primary"
                            size="small"
                            icon={<Ionicons name="add-outline" size={16} color={colors.white} />}
                            iconFlex="left"
                        />
                    </View>
                </View>
                <TextComponent text={data?.title || ''} className="text-[20px] mt-4" color={colors.primary500} />
            </SectionComponent>

            <SectionComponent>
                {content ? (
                    <RenderHtml contentWidth={appInfo.sizes.WIDTH} source={{ html: content }} />
                ) : (
                    <View className="items-center mt-4 justify-center">
                        <ActivityIndicator size={'large'} />
                    </View>
                )}
            </SectionComponent>
        </ContainerComponent>
    );
};

export default DetailsScreen;
