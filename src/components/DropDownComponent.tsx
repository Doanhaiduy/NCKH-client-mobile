import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import TextComponent from './TextComponent';
import SelectDropdown from 'react-native-select-dropdown';
import RowComponent from './RowComponent';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

type Data = {
    title: string;
    value: string;
};

interface Props {
    title: string;
    data: Data[];
    onSelect: (selectedItem: Data, index: number) => void;
    width?: number; // default 140
}

export default function DropDownComponent(props: Props) {
    const { title, data, onSelect, width = 140 } = props;
    console.log(1);
    return (
        <RowComponent className="mt-2">
            {title && <TextComponent text={`${title}: `} />}
            <SelectDropdown
                data={data}
                onSelect={onSelect}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View
                            style={[
                                styles.dropdownButtonStyle,
                                {
                                    width,
                                },
                            ]}
                        >
                            <TextComponent className="" text={(selectedItem && selectedItem.title) || data[0].title} />
                            <Ionicons
                                name={isOpened ? 'chevron-up' : 'chevron-down'}
                                size={18}
                                color={colors.primary400}
                            />
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (
                        <View
                            style={{
                                ...styles.dropdownItemStyle,
                                ...(isSelected && { backgroundColor: '#235DF426' }),
                            }}
                        >
                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                        </View>
                    );
                }}
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
