import { View, TextInput, TouchableOpacity, Pressable, ScrollView, Keyboard } from 'react-native';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import TextComponent from './TextComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appInfo } from '@/constants/appInfo';

type Props = {
    onSubmit?: (text?: string) => void;
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
};

const SearchItem = (props: { text: string; onSubmit: (text?: string) => void; onDelete: () => void }) => {
    const { text, onSubmit, onDelete } = props;

    return (
        <View className="w-full flex-row items-center">
            <TouchableOpacity
                className="items-center flex-row space-x-2 flex-1 py-2"
                onPress={() => {
                    console.log('text123123', text);
                    onSubmit(text);
                }}
            >
                <Ionicons name="time-outline" size={28} color={colors.text400} />
                <TextComponent text={text} />
            </TouchableOpacity>
            <Pressable onPress={onDelete}>
                <Ionicons name="close" size={28} color={colors.text400} />
            </Pressable>
        </View>
    );
};

const SearchComponent = (props: Props) => {
    const { value, onChangeText: setValue, onSubmit, placeholder, onClear } = props;
    const [SearchHistory, setSearchHistory] = React.useState<string[]>([]);
    const [visible, setVisible] = React.useState(true);

    useEffect(() => {
        handleSetSearchHistory();
    }, []);

    const handleSetSearchHistory = () => {
        const searchItemAsync = AsyncStorage.getItem('searchItem');
        searchItemAsync.then((value) => {
            console.log('value', value);
            if (value) {
                const searchItem = JSON.parse(value);
                setSearchHistory(searchItem.reverse());
            } else {
                setSearchHistory([]);
            }
        });
    };

    const handleDeleteSearchHistory = (text: string) => {
        const searchItemAsync = AsyncStorage.getItem('searchItem');
        searchItemAsync.then((value) => {
            console.log('value', value);
            if (value) {
                const searchItem = JSON.parse(value);
                const newSearchItem = searchItem.filter((item: string) => item !== text);
                AsyncStorage.setItem('searchItem', JSON.stringify(newSearchItem));
                setSearchHistory(newSearchItem.reverse());
            } else {
                AsyncStorage.setItem('searchItem', JSON.stringify([]));
                setSearchHistory([]);
            }
        });
    };

    const handleSubmit = (text?: string) => {
        onSubmit && onSubmit(text);
        setVisible(true);
        handleSetSearchHistory();
    };
    return (
        <View className="w-full relative">
            <View
                className="w-full py-4 px-3 pr-5 bg-primary-100 flex-row items-center space-x-2"
                style={{
                    borderRadius: 99,
                }}
            >
                <Ionicons name="search" size={28} color="#000" />
                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={setValue}
                    onFocus={() => {
                        setVisible(false);
                        handleSetSearchHistory();
                    }}
                    className="text-lg w-full flex-1"
                    enterKeyHint="search"
                    onSubmitEditing={() => {
                        onSubmit && onSubmit();
                        setVisible(true);
                    }}
                />
                {value ? (
                    <TouchableOpacity onPress={onClear}>
                        <Ionicons name="close" size={22} color="#000" />
                    </TouchableOpacity>
                ) : null}
            </View>

            {!visible ? (
                <View
                    className="w-full px-3 py-4 bg-primary-100 rounded-[12px] absolute top-[65px] left-0"
                    style={{
                        zIndex: 9999,
                    }}
                >
                    <TextComponent text="Tìm kiếm gần đây" fontBold />
                    <Pressable
                        onPress={() => {
                            setVisible(true);
                            Keyboard.dismiss();
                        }}
                        className="absolute right-3 top-3"
                    >
                        <Ionicons name="close" size={28} color={colors.text400} />
                    </Pressable>
                    <ScrollView
                        style={{
                            maxHeight: appInfo.sizes.HEIGHT / 2,
                        }}
                        onScroll={() => Keyboard.dismiss()}
                        showsVerticalScrollIndicator={false}
                    >
                        {SearchHistory.length > 0 ? (
                            SearchHistory.map((item, index) => (
                                <SearchItem
                                    key={index}
                                    text={item}
                                    onSubmit={handleSubmit}
                                    onDelete={() => handleDeleteSearchHistory(item)}
                                />
                            ))
                        ) : (
                            <TextComponent text="Không có lịch sử tìm kiếm" className="text-center mt-2" />
                        )}
                    </ScrollView>
                </View>
            ) : null}
        </View>
    );
};

export default SearchComponent;
