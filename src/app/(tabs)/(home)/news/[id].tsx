import { View, ActivityIndicator, Share, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import postAPI from '@/apis/postApi';
import RenderHtml from 'react-native-render-html';
import { appInfo } from '@/constants/appInfo';
import { ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { dateFormat } from '@/utils/dateTime';
import ImageComponent from '@/components/ImageComponent';
import { useRefreshing } from '@/hooks/useRefreshing';
import { useTranslation } from 'react-i18next';

type Props = {};

const DetailsScreen = (props: Props) => {
    const { id } = useLocalSearchParams();
    const [content, setContent] = React.useState<string>('');
    const { t } = useTranslation();

    const { data, isFetching, refetch } = useQuery<Post>({
        queryKey: ['post-details', id],
        queryFn: () => postAPI.getDetailPost(id!.toString()),
    });

    const { refreshing, handleRefresh } = useRefreshing(refetch);

    useEffect(() => {
        if (data) {
            setContent(data.content || '');
        }
    }, [data]);

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `${appInfo.base_view_url}/posts/${data?.slug ?? data?._id}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ContainerComponent
            title={t('news_details.title')}
            iconLeft='back'
            notification
            isScroll
            _refreshing={refreshing}
            handleRefresh={handleRefresh}
        >
            {isFetching ? (
                <View className='items-center mt-4 justify-center'>
                    <ActivityIndicator size={'large'} />
                </View>
            ) : data ? (
                <>
                    <ImageComponent showImageModal url={data?.thumbnail!} imageClass='w-full' aspectRatio={16 / 9} />
                    <SectionComponent>
                        <View className='flex-row justify-between mt-3 w-full'>
                            <RowComponent className=''>
                                <Ionicons name='calendar' size={14} color={colors.black} />
                                <TextComponent
                                    text={dateFormat(data?.createdAt || '')}
                                    className='ml-1 text-[13px] text-text-400'
                                />
                            </RowComponent>
                            <View className='flex-row items-center'>
                                <TouchableOpacity onPress={handleShare} className='p-2'>
                                    <Ionicons name='share-social' size={24} color={colors.primary500} />
                                </TouchableOpacity>
                                <SpaceComponent width={12} />
                                <></>
                            </View>
                        </View>
                        <TextComponent
                            text={data?.title || ''}
                            className='text-[20px] mt-4'
                            color={colors.primary500}
                        />
                    </SectionComponent>

                    <SectionComponent>
                        {content ? (
                            <RenderHtml contentWidth={appInfo.sizes.WIDTH} source={{ html: content }} />
                        ) : (
                            <View className='items-center mt-4 justify-center'>
                                <ActivityIndicator size={'large'} />
                            </View>
                        )}
                    </SectionComponent>
                </>
            ) : (
                <TextComponent className='text-center' text={t('news_details.no_data')} />
            )}
        </ContainerComponent>
    );
};

export default DetailsScreen;
