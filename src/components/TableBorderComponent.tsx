import { colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useImperativeHandle } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import ButtonComponent from './ButtonComponent';
import TextComponent from './TextComponent';
import { flattenCriteria, romanize } from '@/utils';
import trainingPointAPI from '@/apis/trainingPointApi';

interface Props {
    data?: Criteria[];
    numOfColumns?: number;
    isUpload?: boolean;
    isAssessment?: boolean;
    idTrainingPoint?: string;
}

function TableBorderComponent(props: Props, ref: any) {
    const { numOfColumns = 3, isUpload, data, isAssessment, idTrainingPoint } = props;
    const [flattenedData, setFlattenedData] = React.useState<flattenCriteria[] | null>(null);

    const handleChange = (value: number, id: string) => {
        const maxScore = flattenedData?.find((item) => item.id === id)?.maxScore;

        if (value > maxScore!) {
            return;
        }

        if (maxScore! >= 0 && value < 0) {
            return;
        }

        const newData = flattenedData?.map((item) => {
            if (item.id === id) {
                return { ...item, tempScore: value };
            }
            return item;
        });
        setFlattenedData(newData!);
    };

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));

    const handleSubmit = async () => {
        try {
            const newData: CriteriaScoreParams[] | undefined = flattenedData
                ?.filter((item) => item.activeChange)
                ?.filter((item) => item.tempScore !== item.totalScore)
                ?.map((item) => {
                    return { criteriaId: item.id, score: item.tempScore };
                });

            const res = await trainingPointAPI.updateScoresAssessment(idTrainingPoint, newData!);
            if (res) {
                console.log('res', res);
                return true;
            }
        } catch (error: any) {
            Alert.alert('Thông báo', error);
            return false;
        }
    };

    useEffect(() => {
        if (data) {
            setFlattenedData(flattenCriteria(data!));
        }
    }, [data]);

    return (
        <View className="min-w-full px-2">
            <View className="flex-row flex-nowrap border-text-200 border-y-[1px] ">
                <View className="w-[10%] items-start border-text-200 py-3 px-1 border-x-[1px] justify-center">
                    <TextComponent text="Mã TC" fontBold />
                </View>
                <View className="w-[50%] items-start border-text-200 py-3 px-1 border-x-[1px] justify-center">
                    <TextComponent text="Tên tiêu chí" fontBold />
                </View>
                {isUpload ? (
                    <>
                        <View className="flex-1 items-start  py-3 px-1 border-text-200 border-r-[1px] justify-center">
                            <TextComponent text="Tải lên minh chứng" fontBold />
                        </View>
                    </>
                ) : (
                    <>
                        <View className="flex-1 items-start  py-3 px-1 border-text-200 border-r-[1px] justify-center">
                            <TextComponent text="Điểm tối đa" fontBold />
                        </View>
                        {!isAssessment && (
                            <View className="flex-1 items-start  py-3 px-1 border-text-200 border-r-[1px] justify-center">
                                <TextComponent text="Điểm đã duyệt" fontBold />
                            </View>
                        )}
                        <View className="flex-1 items-start  py-3 px-1 border-text-200 border-r-[1px] justify-center">
                            <TextComponent text="Điểm tự đánh giá" fontBold />
                        </View>
                    </>
                )}
            </View>
            {/* Body */}
            {!data ? null : (
                <View className="flex-1">
                    {flattenedData?.map((item, index) => (
                        <View
                            key={index}
                            className="flex-row flex-nowrap  border-text-200 border-b-[1px] "
                            style={{
                                backgroundColor: index % 2 === 0 ? '#F3F4F6' : '#fff',
                            }}
                        >
                            <View className="w-[10%] items-start justify-center py-3 px-1 border-text-200 border-x-[1px] ">
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
                                className="w-[50%] items-start py-3 px-1 border-text-200 border-x-[1px] justify-center"
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
                                    {item.require && !item.evidence && (
                                        <ButtonComponent
                                            onPress={() => {
                                                router.push({
                                                    pathname: '/training-point/upload-image',
                                                    params: { id: item.id },
                                                });
                                            }}
                                            title="Tải lên"
                                            type="outline"
                                            size="small"
                                            icon={<Feather name="upload" size={18} color={colors.primary400} />}
                                        />
                                    )}

                                    {item.require && item.evidence && (
                                        <ButtonComponent
                                            onPress={() => {
                                                router.push({
                                                    pathname: '/training-point/upload-image',
                                                    params: { id: item.id },
                                                });
                                            }}
                                            title="Đã tải lên"
                                            type="outline"
                                            size="small"
                                            icon={<Feather name="image" size={18} color={colors.primary400} />}
                                        />
                                    )}

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
                            ) : isAssessment ? (
                                <>
                                    <View className="flex-1 py-3 px-1 border-text-200 items-center border-r-[1px] justify-center">
                                        <TextComponent text={item?.maxScore.toString() || ''} />
                                    </View>
                                    <View className="flex-1 py-3 px-1 border-text-200 items-center border-r-[1px] justify-center">
                                        <TextInput
                                            className="text-center border-text-200 border-[1px] rounded-md py-3 px-4"
                                            style={{
                                                textAlign: 'center',
                                                backgroundColor: item.activeChange ? '#fff' : '#eee',
                                            }}
                                            keyboardType="number-pad"
                                            readOnly={!item.activeChange}
                                            value={item?.tempScore.toString() === '0' ? '' : item?.tempScore.toString()}
                                            onChange={(e) => {
                                                handleChange(+e.nativeEvent.text, item.id);
                                            }}
                                        />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View className="flex-1 py-3 px-1 border-text-200 items-center border-r-[1px] ">
                                        <TextComponent text={item?.maxScore.toString() || ''} />
                                    </View>
                                    <View className="flex-1 py-3 px-1 border-text-200 items-center border-r-[1px] ">
                                        <TextComponent text={item?.totalScore.toString() || ''} />
                                    </View>
                                    <View className="flex-1 py-3 px-1 border-text-200 items-center border-r-[1px] ">
                                        <TextComponent text={item?.tempScore.toString() || ''} />
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

export default React.forwardRef(TableBorderComponent);

const styles = StyleSheet.create({});
