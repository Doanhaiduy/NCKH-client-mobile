import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import clsx from 'clsx';
import { Ionicons } from '@expo/vector-icons';
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
}

export default function InputComponent(props: Props) {
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
        ...inputProps
    } = props;

    const containerClass = clsx(
        'w-full max-w-full rounded-[10px] border-[1px] border-primary-400 h-[56px]  min-h-[56px] justify-between  bg-white flex-row items-center',
        {
            'border-error': err,
        }
    );

    const inputClass = clsx(
        'flex-1  w-full font-inter text-sm text-black px-5 placeholder:text-base placeholder:text-text-600 placeholder:font-inter'
    );

    return (
        <View className='mt-4 w-full'>
            <Pressable className={containerClass} onPress={() => inputRef.current?.focus()}>
                <View className='flex-col flex-1'>
                    {value && <Text className='px-5 pt-2 text-[12px] text-black font-inter'>{placeholder}</Text>}
                    <TextInput
                        ref={inputRef}
                        autoCapitalize='none'
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
                        style={{
                            marginBottom: value ? 10 : 0,
                        }}
                    />
                </View>
                {value && !isPassword && (
                    <Pressable onPress={() => onChange('')} className='mr-5'>
                        <Ionicons name='close' size={18} color={color ?? 'black'} />
                    </Pressable>
                )}

                {value && isPassword && (
                    <Pressable onPress={() => setIsShowPassword(!isShowPassword)} className='mr-5'>
                        {isShowPassword ? (
                            <Ionicons name='eye' size={18} color={color ?? 'black'} />
                        ) : (
                            <Ionicons name='eye-off' size={18} color={color ?? 'black'} />
                        )}
                    </Pressable>
                )}
            </Pressable>
            {err && <Text className='px-3 pt-1 text-[12px] text-error font-inter'>{err}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({});
