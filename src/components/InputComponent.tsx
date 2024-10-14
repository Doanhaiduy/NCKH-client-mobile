import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import TextComponent from './TextComponent';
import RowComponent from './RowComponent';
interface Props {
    placeholder?: string;
    value: string;
    onChange: (val: string) => void;
    onEnd?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
    isPassword?: boolean;
    err?: string;
    isDisabled?: boolean;
    type?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
    numberOfLines?: number;
    multiline?: boolean;
    icon?: React.ReactNode;
    color?: string;
    labelTop?: string;
    readOnly?: boolean;
    height?: number;
    required?: boolean;
}

function InputComponent(props: Props) {
    const [isShowPassword, setIsShowPassword] = React.useState(false);

    const inputRef = React.useRef<TextInput>(null);

    const {
        placeholder,
        value,
        onChange,
        onEnd,
        onFocus,
        isPassword,
        err,
        type,
        isDisabled,
        numberOfLines,
        multiline,
        color,
        onBlur,
        labelTop,
        readOnly,
        height,
        required,
        ...inputProps
    } = props;
    console.log('InputComponent: value', value);

    const containerClass = clsx(
        'w-full max-w-full rounded-[10px] border-[1px] border-primary-400 h-[56px]  min-h-[56px] justify-between  bg-white flex-row items-center',
        {
            'border-error': err,
        },
    );

    const inputClass = clsx(
        'flex-1  w-full font-inter text-sm text-black px-5 placeholder:text-base placeholder:text-text-100 placeholder:font-inter',
    );

    return (
        <View className="mt-4 w-full">
            {labelTop ? (
                <RowComponent>
                    {required && <TextComponent text="*" className="text-error mr-1" />}
                    <TextComponent text={labelTop} className="mb-1" />
                </RowComponent>
            ) : null}
            <Pressable
                className={containerClass}
                onPress={() => inputRef.current?.focus()}
                style={{
                    height: height ?? 'auto',
                }}
            >
                <View className="flex-col flex-1">
                    {value && placeholder && !labelTop && (
                        <Text className="px-5 pt-1 text-[12px] text-black font-inter">{placeholder}</Text>
                    )}
                    <TextInput
                        ref={inputRef}
                        autoCapitalize="none"
                        {...inputProps}
                        placeholder={placeholder ?? ''}
                        value={value}
                        onChangeText={(val) => onChange(val)}
                        onEndEditing={onEnd}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        secureTextEntry={isPassword && !isShowPassword}
                        keyboardType={type ?? 'default'}
                        editable={!isDisabled}
                        numberOfLines={numberOfLines}
                        multiline={multiline}
                        className={inputClass}
                        readOnly={readOnly}
                        style={{
                            marginBottom: value && placeholder ? 10 : 0,
                            color: color ?? 'black',
                            height: height ?? 'auto',
                        }}
                    />
                </View>
                {value && !isPassword && !readOnly && (
                    <Pressable
                        onPress={() => onChange('')}
                        className="mr-5"
                        style={{
                            position: multiline ? 'absolute' : 'relative',
                            top: multiline ? 10 : 0,
                            right: 0,
                        }}
                    >
                        <Ionicons name="close" size={18} color={color ?? 'black'} />
                    </Pressable>
                )}

                {value && isPassword && (
                    <Pressable onPress={() => setIsShowPassword(!isShowPassword)} className="mr-5">
                        {isShowPassword ? (
                            <Ionicons name="eye" size={18} color={color ?? 'black'} />
                        ) : (
                            <Ionicons name="eye-off" size={18} color={color ?? 'black'} />
                        )}
                    </Pressable>
                )}
            </Pressable>
            {err && <Text className="px-3 pt-1 text-[12px] text-error font-inter">{err}</Text>}
        </View>
    );
}

export default React.memo(InputComponent);
