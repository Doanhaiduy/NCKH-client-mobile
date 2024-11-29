import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';

interface Props {
    title: string;
    data: (AttendanceOption | Semester | Year)[];
    onSelect: (selectedItem: AttendanceOption | Semester | Year, index: number) => void;
    width?: number;
}

export default function DropDownComponent(props: Props) {
    const { title, data, onSelect, width = 140 } = props;

    const currentSemesterYear = data.find((item) => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();

        if ('value' in item && typeof item.value === 'object') {
            return (
                item.value.year === `${month >= 9 || month <= 1 ? year : year - 1}` &&
                item.value.semester === (month >= 9 || month <= 1 ? '1' : '2')
            );
        } else {
            if (item.value === '1' || item.value == '2') {
                return item.value === (month >= 9 || month <= 1 ? '1' : '2');
            } else {
                return item.value === year.toString();
            }
        }
    });

    return (
        <RowComponent className="mt-2">
            {title && <TextComponent text={`${title}: `} />}
            <SelectDropdown
                data={data}
                onSelect={(selectedItem, index) => onSelect(selectedItem, index)}
                renderButton={(selectedItem, isOpened) => {
                    const displayTitle = selectedItem?.title || currentSemesterYear?.title;
                    return (
                        <View style={[styles.dropdownButtonStyle, { width }]}>
                            <TextComponent text={displayTitle || ''} />
                            <Ionicons
                                name={isOpened ? 'chevron-up' : 'chevron-down'}
                                size={18}
                                color={colors.primary400}
                            />
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => (
                    <View
                        style={{
                            ...styles.dropdownItemStyle,
                            ...(isSelected && { backgroundColor: '#03009926' }),
                        }}
                    >
                        <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
            />
        </RowComponent>
    );
}

const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: 140,
        height: 30,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.primary400,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownMenuStyle: {
        backgroundColor: '#FFF',
        borderRadius: 5,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
});
