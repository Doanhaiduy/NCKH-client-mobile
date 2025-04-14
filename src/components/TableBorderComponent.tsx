import { colors } from '@/constants/colors';
import { AntDesign, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useImperativeHandle } from 'react';
import { Alert, TextInput, View } from 'react-native';
import ButtonComponent from './ButtonComponent';
import TextComponent from './TextComponent';
import { flattenCriteria, romanize } from '@/utils';
import trainingPointAPI from '@/apis/trainingPointApi';
import { useTranslation } from 'react-i18next';

interface Props {
    data?: Criteria[];
    numOfColumns?: number;
    isUpload?: boolean;
    isAssessment?: boolean;
    idTrainingPoint?: string;
    isLocked?: boolean;
}

function TableBorderComponent(props: Props, ref: any) {
    const { t } = useTranslation();
    const { numOfColumns = 3, isUpload, data, isAssessment, idTrainingPoint, isLocked } = props;
    const [flattenedData, setFlattenedData] = React.useState<flattenCriteria[] | null>(null);
    const handleChange = (value: number, id: string) => {
        const maxScore = flattenedData?.find((item) => item._id === id)?.maxScore;
        if (value > maxScore! && maxScore! > 0) {
            return;
        }
        if (maxScore! > 0 && value < 0) {
            return;
        }

        const newData = flattenedData?.map((item) => {
            if (item._id === id) {
                return { ...item, tempScore: maxScore! === 0 ? -value : value };
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
                ?.filter((item) => {
                    if (item.maxScore === 0 && item.activeChange) {
                        return true;
                    } else {
                        return item.totalScore !== item.tempScore;
                    }
                })
                ?.filter((item) => !isNaN(item.tempScore))
                ?.map((item) => {
                    return { criteriaId: item._id, score: item.tempScore };
                });
            const res = await trainingPointAPI.updateScoresAssessment(idTrainingPoint, newData!);
            if (res) {
                return true;
            }
        } catch (error: any) {
            Alert.alert(t('table_border_component.notification'), error);
            return false;
        }
    };

    useEffect(() => {
        if (data) {
            setFlattenedData(flattenCriteria(data!));
        }
    }, [data]);

    const renderButton = (item: flattenCriteria) => {
        if (item.require && !item.evidence) {
            return (
                <ButtonComponent
                    onPress={() => {
                        router.push({
                            pathname: '/training-point/upload-image',
                            params: { id: item._id, criteriaCode: item.criteriaCode, isLocked: isLocked ? 1 : 0 },
                        });
                    }}
                    title={t('table_border_component.upload')}
                    type='outline'
                    size='small'
                    icon={<Feather name='upload' size={18} color={colors.primary400} />}
                />
            );
        } else {
            const status = item.evidence?.status;
            switch (status) {
                case 'pending':
                    return (
                        <ButtonComponent
                            onPress={() => {
                                router.push({
                                    pathname: '/training-point/upload-image',
                                    params: {
                                        id: item._id,
                                        criteriaCode: item.criteriaCode,
                                        isLocked: isLocked ? 1 : 0,
                                        hasCount: item.hasCount ? 1 : 0,
                                    },
                                });
                            }}
                            title={t('table_border_component.uploaded')}
                            type='outline'
                            size='small'
                            icon={<Feather name='image' size={18} color={colors.primary400} />}
                        />
                    );
                case 'approved':
                    return (
                        <ButtonComponent
                            onPress={() => {
                                router.push({
                                    pathname: '/training-point/upload-image',
                                    params: {
                                        id: item._id,
                                        criteriaCode: item.criteriaCode,
                                        isLocked: isLocked ? 1 : 0,
                                    },
                                });
                            }}
                            title={t('table_border_component.approved')}
                            type='primary'
                            size='small'
                            iconContainerClass='mr-1'
                            icon={<AntDesign name='checkcircleo' size={20} color='white' />}
                        />
                    );
                case 'rejected':
                    return (
                        <ButtonComponent
                            onPress={() => {
                                router.push({
                                    pathname: '/training-point/upload-image',
                                    params: {
                                        id: item._id,
                                        criteriaCode: item.criteriaCode,
                                        isLocked: isLocked ? 1 : 0,
                                    },
                                });
                            }}
                            title={t('table_border_component.rejected')}
                            type='grey'
                            size='small'
                            iconContainerClass='mr-1'
                            icon={<AntDesign name='closecircleo' size={20} color='white' />}
                        />
                    );
                default:
                    return null;
            }
        }
    };

    return (
        <View className='min-w-full px-2'>
            <View className='flex-row flex-nowrap border-text-200 border-y-[1px] '>
                <View className='w-[10%] items-start border-text-200 py-3 px-1 border-x-[1px] justify-center'>
                    <TextComponent text={t('table_border_component.criteria_code')} fontBold />
                </View>
                <View className='w-[50%] items-start border-text-200 py-3 px-1 border-x-[1px] justify-center'>
                    <TextComponent text={t('table_border_component.criteria_name')} fontBold />
                </View>
                {isUpload ? (
                    <>
                        <View className='flex-1 items-start py-3 px-1 border-text-200 border-r-[1px] justify-center'>
                            <TextComponent text={t('table_border_component.upload_evidence')} fontBold />
                        </View>
                    </>
                ) : (
                    <>
                        <View className='flex-1 items-start py-3 px-1 border-text-200 border-r-[1px] justify-center'>
                            <TextComponent text={t('table_border_component.max_score')} fontBold />
                        </View>
                        {!isAssessment && (
                            <View className='flex-1 items-start py-3 px-1 border-text-200 border-r-[1px] justify-center'>
                                <TextComponent text={t('table_border_component.approved_score')} fontBold />
                            </View>
                        )}
                        <View className='flex-1 items-start py-3 px-1 border-text-200 border-r-[1px] justify-center'>
                            <TextComponent text={t('table_border_component.self_assessment_score')} fontBold />
                        </View>
                    </>
                )}
            </View>
            {/* Body */}
            {!data ? null : (
                <View className='flex-1'>
                    {flattenedData?.map((item, index) => (
                        <View
                            key={index}
                            className='flex-row flex-nowrap border-text-200 border-b-[1px]'
                            style={{
                                backgroundColor: index % 2 === 0 ? '#F3F4F6' : '#fff',
                            }}
                        >
                            <View className='w-[10%] items-start justify-center py-3 px-1 border-text-200 border-x-[1px]'>
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
                                className='w-[50%] items-start py-3 px-1 border-text-200 border-x-[1px] justify-center'
                                style={{
                                    paddingLeft: item.level === 1 ? 4 : item.level === 2 ? 20 : 40,
                                }}
                            >
                                <TextComponent
                                    text={`${item.title} ${item.description ? `(${item.description})` : ''}`}
                                    style={{
                                        fontWeight: item.level === 1 ? 'bold' : item.level === 2 ? 'normal' : 'normal',
                                    }}
                                />
                            </View>

                            {isUpload ? (
                                <View className='flex-1 py-3 px-1 border-text-200 border-r-[1px] items-center justify-center'>
                                    {renderButton(item)}
                                </View>
                            ) : isAssessment ? (
                                <>
                                    <View className='flex-1 py-3 px-1 border-text-200 items-center border-r-[1px] justify-center'>
                                        <TextComponent text={item?.maxScore.toString() || ''} />
                                    </View>
                                    <View className='flex-1 py-3 px-1 flex-row border-text-200 items-center border-r-[1px] justify-center'>
                                        {
                                            <TextComponent
                                                className='absolute left-1'
                                                text={item?.maxScore === 0 && item.activeChange ? '-' : ''}
                                            />
                                        }
                                        <TextInput
                                            className='text-center border-text-200 border-[1px] rounded-md py-3 px-2 min-w-[35px]'
                                            style={{
                                                textAlign: 'center',
                                                backgroundColor: item.activeChange ? '#fff' : '#eee',
                                            }}
                                            keyboardType='numbers-and-punctuation'
                                            readOnly={!item.activeChange}
                                            value={
                                                item.maxScore === 0
                                                    ? item?.tempScore.toString() === '0'
                                                        ? '0'
                                                        : item?.tempScore < 0
                                                          ? (-item?.tempScore).toString()
                                                          : item?.tempScore.toString()
                                                    : ''
                                            }
                                            onChange={(e) => {
                                                if (
                                                    !Number(e.nativeEvent.text) &&
                                                    item.maxScore !== 0 &&
                                                    e.nativeEvent.text !== ''
                                                ) {
                                                    return;
                                                }
                                                handleChange(+e.nativeEvent.text, item._id);
                                            }}
                                        />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View className='flex-1 py-3 px-1 border-text-200 items-center border-r-[1px]'>
                                        <TextComponent text={item?.maxScore.toString() || ''} />
                                    </View>
                                    <View className='flex-1 py-3 px-1 border-text-200 items-center border-r-[1px]'>
                                        <TextComponent text={item?.totalScore.toString() || ''} />
                                    </View>
                                    <View className='flex-1 py-3 px-1 border-text-200 items-center border-r-[1px]'>
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
