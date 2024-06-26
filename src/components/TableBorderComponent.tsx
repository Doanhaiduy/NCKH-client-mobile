import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import TextComponent from './TextComponent';
import ButtonComponent from './ButtonComponent';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';

const ActiveData = [
    {
        name: '1. Ý thức học tập của sv',
        maxPoint: 20,
        currentPoint: 0,
        require: false,
    },

    {
        name: '1.1. Kết quả học tập trong học kỳ',
        maxPoint: 4,
        currentPoint: 0,
        require: false,
    },
    {
        name: '- Đạt tất cả (4 điểm)',
        maxPoint: 4,
        currentPoint: 0,
        require: false,
    },
    {
        name: '- Nợ 1 môn (2 điểm)',
        maxPoint: 2,
        currentPoint: 0,
        require: false,
    },
    {
        name: '- Nợ 2 môn (1 điểm)',
        maxPoint: 1,
        currentPoint: 0,
        require: false,
    },
    {
        name: '- Nợ 3 môn trở lên (0 điểm)',
        maxPoint: 0,
        currentPoint: 0,
        require: false,
    },
    {
        name: '1.2. Tham gia các hoạt động học thuật: Tham gia các hoạt động học thuật được khoa/viện, bộ môn xác nhận',
        maxPoint: 10,
        currentPoint: 0,
        require: false,
    },
    {
        name: '- Tham gia các buổi tọa đàm, hội nghị, hội thảo khoa học (2 điểm/1 lần)',
        maxPoint: 10,
        currentPoint: 0,
        require: true,
    },
    {
        name: '- Là chủ nhiệm đề tài/cộng tác viên đề tài NCKH các cấp (10 điểm)',
        maxPoint: 10,
        currentPoint: 0,
        require: true,
    },
    {
        name: '- Là thành viên tích cực của ít nhất một câu lạc bộ học thuật (5 điểm)',
        maxPoint: 5,
        currentPoint: 0,
        require: true,
    },
    {
        name: '- Tham gia các cuộc thi học thuật (2 điểm/1 cuộc thi nếu có tham gia hoặc 5 điểm/1 cuộc thi nếu có tham gia và đạt giải)',
        maxPoint: 10,
        currentPoint: 0,
        require: true,
    },
    {
        name: '1.3. Xếp loại về học tập',
        maxPoint: 5,
        currentPoint: 0,
        require: false,
    },
    {
        name: '- Xuất sắc (5 điểm)',
        maxPoint: 5,
        currentPoint: 0,
        require: false,
    },
    {
        name: '- Giỏi (3 điểm)',
        maxPoint: 3,
        currentPoint: 0,
        require: false,
    },
    {
        name: '- Trung bình (1 điểm)',
        maxPoint: 2,
        currentPoint: 0,
        require: false,
    },
    {
        name: '- Yếu, kém (0 điểm)',
        maxPoint: 1,
        currentPoint: 0,
        require: false,
    },
    {
        name: '1.4. Kết quả học tập học kỳ luôn duy trì ở loại khá trở lên hoặc vượt lên ít nhất một bậc xếp loại đối với loại kém, trung bình so với học kỳ trước',
        maxPoint: 0,
        currentPoint: 0,
        require: false,
    },
];

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
    const { data = ActiveData, numOfColumns = 3, isUpload } = props;
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
                {ActiveData.map((item, index) => (
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
