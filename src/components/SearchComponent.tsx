import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
};

const SearchComponent = (props: Props) => {
    const { value, onChangeText: setValue, placeholder, onClear } = props;

    return (
        <View className="w-full relative">
            <View
                className="w-full px-3 pr-5 bg-primary-100 flex-row items-center space-x-2"
                style={{
                    borderRadius: 99,
                    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
                }}
            >
                <Ionicons name="search" size={28} color="#000" />
                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={setValue}
                    className="text-lg w-full flex-1"
                    enterKeyHint="search"
                />
                {value ? (
                    <TouchableOpacity onPress={onClear}>
                        <Ionicons name="close" size={22} color="#000" />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
};

export default SearchComponent;
