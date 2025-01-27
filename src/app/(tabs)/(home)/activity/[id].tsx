import { View, Text, Image, Pressable, ActivityIndicator, Share, Alert, TouchableOpacity } from 'react-native';
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
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { dateFormat, dateFormatLocale } from '@/utils/dateTime';
import ImageComponent from '@/components/ImageComponent';
import { useRefreshing } from '@/hooks/useRefreshing';
import eventAPI from '@/apis/eventApi';
import { useDispatch } from 'react-redux';
import { setEventNeedsRefresh } from '@/stores/reducers/refreshReducer';

type Props = {};

const DetailsScreen = (props: Props) => {
    const { id } = useLocalSearchParams();
    const [content, setContent] = React.useState<string>('');
    const dispatch = useDispatch();

    const [btnTypeAction, setBtnTypeAction] = React.useState<
        'none' | 'register' | 'unregister' | 'expired' | 'full' | 'already' | 'preventUnregister'
    >('none');

    const { data, isFetching, refetch } = useQuery<Post>({
        queryKey: ['post-details', id],
        queryFn: () => postAPI.getDetailPost(id!.toString()),
    });

    const { refreshing, handleRefresh } = useRefreshing(refetch);

    useEffect(() => {
        console.log(data);
        if (data) {
            setContent(data.content || '');
            setBtnTypeAction(data.typeAction!);
        }
    }, [data]);

    const handleAction = async () => {
        try {
            if (btnTypeAction === 'register') {
                const res = await eventAPI.registerEvent(data?.event?.toString()!);
                if (res) {
                    dispatch(setEventNeedsRefresh(true));
                    setBtnTypeAction('unregister');
                }
            } else if (btnTypeAction === 'unregister') {
                const res = await eventAPI.unRegisterEvent(data?.event?.toString()!);
                if (res) {
                    dispatch(setEventNeedsRefresh(true));
                    setBtnTypeAction('register');
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `${appInfo.base_view_url}/posts/${data?.slug ?? data?._id}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const renderBtn = () => {
        switch (btnTypeAction) {
            case 'none':
                return <></>;
            case 'unregister':
                return (
                    <ButtonComponent
                        containerClass="ml-4"
                        onPress={handleAction}
                        title="Hủy đăng ký"
                        type="primary"
                        size="small"
                        icon={<AntDesign name="closecircleo" size={16} color={colors.white} />}
                        iconFlex="left"
                        iconContainerClass="mr-2"
                    />
                );
            case 'register':
                return (
                    <ButtonComponent
                        onPress={handleAction}
                        title="Đăng ký"
                        type="primary"
                        size="small"
                        icon={<Ionicons name="add-outline" size={16} color={colors.white} />}
                        iconFlex="left"
                        iconContainerClass="mr-2"
                        containerClass="ml-4"
                    />
                );
            case 'full':
                return (
                    <ButtonComponent
                        onPress={() => {}}
                        disabled
                        title="Đã đủ số lượng"
                        type="grey"
                        size="small"
                        icon={<MaterialIcons name="bar-chart" size={16} color={colors.white} />}
                        iconFlex="left"
                        iconContainerClass="mr-2"
                        containerClass="ml-4"
                    />
                );
            case 'expired':
                return (
                    <ButtonComponent
                        onPress={() => {}}
                        disabled
                        title="Hết hạn đăng ký"
                        type="grey"
                        size="small"
                        icon={<MaterialCommunityIcons name="timer-off" size={16} color={colors.white} />}
                        iconFlex="left"
                        iconContainerClass="mr-2"
                        containerClass="ml-4"
                    />
                );

            case 'already':
                return (
                    <ButtonComponent
                        onPress={() => {}}
                        disabled
                        title="Đã điểm danh"
                        type="grey"
                        size="small"
                        icon={<Feather name="user-check" size={16} color={colors.white} />}
                        iconFlex="left"
                        iconContainerClass="mr-2"
                        containerClass="ml-4"
                    />
                );
            case 'preventUnregister':
                return (
                    <ButtonComponent
                        onPress={() => {
                            Alert.alert('Thông báo', 'Không thể hủy đăng ký khi sự kiện sắp diễn ra', [{ text: 'OK' }]);
                        }}
                        title="Hủy đăng ký"
                        type="primary"
                        size="small"
                        icon={<AntDesign name="closecircleo" size={16} color={colors.white} />}
                        iconFlex="left"
                        iconContainerClass="mr-2"
                        containerClass="ml-4"
                    />
                );
            default:
                return <></>;
        }
    };

    return (
        <ContainerComponent
            title={`Hoạt động ngoại khóa`}
            iconLeft="back"
            notification
            isScroll
            _refreshing={refreshing}
            handleRefresh={handleRefresh}
        >
            {isFetching ? (
                <View className="items-center mt-4 justify-center">
                    <ActivityIndicator size={'large'} />
                </View>
            ) : data ? (
                <>
                    <ImageComponent showImageModal url={data?.thumbnail!} imageClass="w-full" aspectRatio={16 / 9} />
                    <SectionComponent>
                        <View className="flex-row justify-between mt-3 w-full">
                            <RowComponent className="">
                                <Ionicons name="calendar" size={14} color={colors.black} />
                                <TextComponent
                                    text={dateFormatLocale(data?.createdAt || '')}
                                    className="ml-1 text-[13px] text-text-400"
                                />
                            </RowComponent>
                            <View className="flex-row items-center">
                                <TouchableOpacity onPress={handleShare} className="p-2">
                                    <Ionicons name="share-social" size={24} color={colors.primary500} />
                                </TouchableOpacity>
                                <View className="">{renderBtn()}</View>
                            </View>
                        </View>
                        <TextComponent
                            text={data?.title || ''}
                            className="text-[20px] mt-4"
                            color={colors.primary500}
                        />
                    </SectionComponent>

                    <SectionComponent>
                        {content ? (
                            <RenderHtml contentWidth={appInfo.sizes.WIDTH} source={{ html: content }} />
                        ) : (
                            <View className="items-center mt-4 justify-center w-full">
                                <ActivityIndicator size={'large'} color={colors.primary500} />
                            </View>
                        )}
                    </SectionComponent>
                </>
            ) : (
                <TextComponent className="text-center" text="Không có dữ liệu" />
            )}
        </ContainerComponent>
    );
};

export default DetailsScreen;
