import {
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TextInput,
    TextInputChangeEventData,
    TextInputSelectionChangeEventData,
    View,
} from 'react-native';
import React from 'react';
import clsx from 'clsx';

interface Props extends React.ComponentProps<typeof TextInput> {
    placeholder?: string;
    value: string;
    onChangeText: (val: string) => void;
    onEnd?: () => void;
    onFocus?: () => void;
    isPassword?: boolean;
    err?: string;
    isNumber?: boolean;
    isDisabled?: boolean;
    numberOfLines?: number;
    multiline?: boolean;
    icon?: React.ReactNode;
    color?: string;
}

export default function InputComponent(props: Props) {
    const {
        placeholder,
        value = 'lorem ipsum dolor sit amet l',
        onChangeText,
        onEnd,
        onFocus,
        isPassword,
        err = 'email is required',
        isNumber,
        isDisabled,
        numberOfLines,
        multiline,
        color,
        ...inputProps
    } = props;

    const containerClass = clsx(
        'w-full rounded-[10px] border-[1px] border-primary-400  min-h-[56px] justify-center  bg-white flex-col items-start',
        {
            'border-error': !!err,
        }
    );

    const inputClass = clsx(
        'flex-1 font-inter text-sm text-black px-5 placeholder:text-base placeholder:text-text-600 placeholder:font-inter',
        {
            'pb-1': !!value,
        }
    );

    return (
        <View className='mt-4'>
            <View className={containerClass}>
                {value && <Text className='px-5 pt-2 text-[12px] text-black font-inter'>{placeholder}</Text>}
                <TextInput
                    {...inputProps}
                    placeholder={placeholder ?? ''}
                    value={value}
                    onChangeText={(val) => onChangeText(val)}
                    onEndEditing={onEnd}
                    onFocus={onFocus}
                    secureTextEntry={isPassword}
                    keyboardType={isNumber ? 'numeric' : 'default'}
                    editable={!isDisabled}
                    numberOfLines={numberOfLines}
                    multiline={multiline}
                    className={inputClass}
                />
            </View>
            {err && <Text className='px-3 pt-1 text-[12px] text-error font-inter'>{err}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({});
