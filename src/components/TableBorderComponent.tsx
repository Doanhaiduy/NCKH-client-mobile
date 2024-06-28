import { colors } from '@/constants/colors';
import { ActiveDataTrainingPoint } from '@/mockData';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ButtonComponent from './ButtonComponent';
import TextComponent from './TextComponent';

interface Props {
    data?: Array<{
        name: string;
        maxPoint: number;
        currentPoint: number;
    }>;
    numOfColumns?: number;
    isUpload?: boolean;
}

export default function TableBorderComponent(props: Props) {
    const { numOfColumns = 3, isUpload } = props;
    return (
        <View className="min-w-full flex-1 px-2">
            <View className="flex-row flex-nowrap flex-1 border-text-500 border-y-[1px] ">
                <View className="w-[60%] items-start border-text-500 py-3 px-1 border-x-[1px]">
                    <TextComponent text="Tên tiêu chí" fontBold />
                </View>
                {isUpload ? (
                    <>
                        <View className="flex-1 items-start  py-3 px-1 border-text-500 border-r-[1px]">
                            <TextComponent text="Tải lên minh chứng" fontBold />
                        </View>
                    </>
                ) : (
                    <>
                        <View className="flex-1 items-start  py-3 px-1 border-text-500 border-r-[1px]">
                            <TextComponent text="Điểm tối đa" fontBold />
                        </View>
                        <View className="flex-1 items-start  py-3 px-1 border-text-500 border-r-[1px]">
                            <TextComponent text="Điểm hiện tại" fontBold />
                        </View>
                    </>
                )}
            </View>
            {/* Body */}
            <View className="flex-1">
                {ActiveDataTrainingPoint.map((item, index) => (
                    <View
                        key={index}
                        className="flex-row flex-nowrap flex-1 border-text-500 border-b-[1px]"
                        style={{
                            backgroundColor: index % 2 === 0 ? '#F3F4F6' : '#fff',
                        }}
                    >
                        <View className="w-[60%] items-start py-3 px-1 border-text-500 border-x-[1px]">
                            <TextComponent text={item.name} />
                        </View>

                        {isUpload ? (
                            <View className="flex-1 py-3 px-1 border-text-500 border-r-[1px] items-center justify-center">
                                {item.require && (
                                    <ButtonComponent
                                        onPress={() => {
                                            router.push({
                                                pathname: '/training-point/upload-image',
                                                params: { id: 1 },
                                            });
                                        }}
                                        title="Tải lên"
                                        type="outline"
                                        size="small"
                                        icon={<Feather name="upload" size={18} color={colors.primary400} />}
                                    />
                                )}

                                {/* uploaded */}
                                {/* {item.require && (
                                    <ButtonComponent
                                        onPress={() => {
                                            router.push({
                                                pathname: '/training-point/upload-image',
                                                params: { id: 1 },
                                            });
                                        }}
                                        title='Đã tải lên'
                                        type='outline'
                                        size='small'
                                        icon={<Feather name='image' size={18} color={colors.primary400} />}
                                    />
                                )} */}

                                {/* Done */}
                                {/* {item.require && (
                                    <ButtonComponent
                                        onPress={() => {
                                            router.push({
                                                pathname: '/training-point/upload-image',
                                                params: { id: 1 },
                                            });
                                        }}
                                        title='Đã duyệt'
                                        type='grey'
                                        size='small'
                                        disabled
                                        icon={<Feather name='check-circle' disabled size={18} color={colors.text200} />}
                                    />
                                )} */}
                            </View>
                        ) : (
                            <>
                                <View className="flex-1 py-3 px-1 border-text-500 items-center border-r-[1px] ">
                                    <TextComponent text={item.maxPoint.toString()} />
                                </View>
                                <View className="flex-1 py-3 px-1 border-text-500 items-center border-r-[1px] ">
                                    <TextComponent text={item.currentPoint.toString()} />
                                </View>
                            </>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
