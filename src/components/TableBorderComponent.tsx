import { colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import ButtonComponent from './ButtonComponent';
import TextComponent from './TextComponent';
import { romanize } from '@/utils';
// import LoadingModal from '../modals/loadingModal';

interface Props {
    data?: Criteria[];
    numOfColumns?: number;
    isUpload?: boolean;
}

const flattenCriteria = (criteria: Criteria[]) => {
    let result: {
        title: string;
        maxScore: number;
        totalScore: number;
        require: boolean;
        level: number;
        criteriaCode: string;
    }[] = [];

    const traverse = (criteria: Criteria[]) => {
        criteria?.forEach((item) => {
            result.push({
                title: item.title,
                maxScore: item.maxScore,
                totalScore: item.totalScore,
                level: item.level,
                require: item.evidenceType !== 'none',
                criteriaCode: item.criteriaCode,
            });

            if (item.subCriteria && item.subCriteria.length > 0) {
                traverse(item.subCriteria);
            }
        });
    };

    traverse(criteria);
    return result;
};

export default function TableBorderComponent(props: Props) {
    const { numOfColumns = 3, isUpload, data } = props;
    const [flattenedData, setFlattenedData] = React.useState<
        | {
              title: string;
              maxScore: number;
              totalScore: number;
              require: boolean;
              level: number;
              criteriaCode: string;
          }[]
        | null
    >(null);

    useEffect(() => {
        if (data) {
            setFlattenedData(flattenCriteria(data!));
        }
    }, [data]);
    return (
        <View className="min-w-full flex-1 px-2">
            <View className="flex-row flex-nowrap flex-1 border-text-200 border-y-[1px] ">
                <View className="w-[10%] items-start border-text-200 py-3 px-1 border-x-[1px]">
                    <TextComponent text="Mã TC" fontBold />
                </View>
                <View className="w-[50%] items-start border-text-200 py-3 px-1 border-x-[1px]">
                    <TextComponent text="Tên tiêu chí" fontBold />
                </View>
                {isUpload ? (
                    <>
                        <View className="flex-1 items-start  py-3 px-1 border-text-200 border-r-[1px]">
                            <TextComponent text="Tải lên minh chứng" fontBold />
                        </View>
                    </>
                ) : (
                    <>
                        <View className="flex-1 items-start  py-3 px-1 border-text-200 border-r-[1px]">
                            <TextComponent text="Điểm tối đa" fontBold />
                        </View>
                        <View className="flex-1 items-start  py-3 px-1 border-text-200 border-r-[1px]">
                            <TextComponent text="Điểm hiện tại" fontBold />
                        </View>
                    </>
                )}
            </View>
            {/* Body */}
            {!data ? (
                <ActivityIndicator size="large" color={colors.primary400} />
            ) : (
                <View className="flex-1">
                    {flattenedData?.map((item, index) => (
                        <View
                            key={index}
                            className="flex-row flex-nowrap flex-1 border-text-200 border-b-[1px] "
                            style={{
                                backgroundColor: index % 2 === 0 ? '#F3F4F6' : '#fff',
                            }}
                        >
                            <View className="w-[10%] items-start justify-center py-3 px-1 border-text-200 border-x-[1px]">
                                <TextComponent
                                    text={
                                        item.level === 1
                                            ? romanize(item.criteriaCode)
                                            : item.level === 2
                                              ? item.criteriaCode
                                              : ''
                                    }
                                />
                            </View>
                            <View
                                className="w-[50%] items-start py-3 px-1 border-text-200 border-x-[1px]"
                                style={{
                                    paddingLeft: item.level === 1 ? 4 : item.level === 2 ? 20 : 40,
                                }}
                            >
                                <TextComponent
                                    text={`${item.title}`}
                                    style={{
                                        fontWeight: item.level === 1 ? 'bold' : item.level === 2 ? 'normal' : 'normal',
                                    }}
                                />
                            </View>

                            {isUpload ? (
                                <View className="flex-1 py-3 px-1 border-text-200 border-r-[1px] items-center justify-center">
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
                                        icon={<Feather name='check-circle' disabled size={18} color={colors.text100} />}
                                    />
                                )} */}
                                </View>
                            ) : (
                                <>
                                    <View className="flex-1 py-3 px-1 border-text-200 items-center border-r-[1px] ">
                                        <TextComponent text={item?.maxScore.toString() || ''} />
                                    </View>
                                    <View className="flex-1 py-3 px-1 border-text-200 items-center border-r-[1px] ">
                                        <TextComponent text={item?.totalScore.toString() || ''} />
                                    </View>
                                </>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({});
