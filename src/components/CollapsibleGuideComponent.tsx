import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Collapsible from 'react-native-collapsible';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import TextComponent from './TextComponent';
import ButtonComponent from './ButtonComponent';
import { colors } from '@/constants/colors';
import ImageComponent from './ImageComponent';
interface GuideContent {
    content: string;
    image?: string;
}
// Define types
interface GuideSection {
    title: string;
    content: string | string[] | GuideContent[];
    image?: string;
    highlighted?: boolean; // Đánh dấu phần này nên được highlight khi mở
}

interface ChevronIconProps {
    isUp: boolean;
    isHighlighted: boolean;
}

interface CollapsibleGuideProps {
    sections: GuideSection[];
}

// SVG Icon component for the dropdown chevron
const ChevronIcon: React.FC<ChevronIconProps> = ({ isUp, isHighlighted }) => {
    return <Entypo name={isUp ? 'chevron-up' : 'chevron-down'} size={24} color={isHighlighted ? '#0066cc' : '#333'} />;
};

const CollapsibleGuide: React.FC<CollapsibleGuideProps> = ({ sections }) => {
    // Sử dụng mảng boolean để theo dõi trạng thái của từng section
    const [collapsedSections, setCollapsedSections] = React.useState<boolean[]>(
        Array(sections.length).fill(true), // Ban đầu tất cả đều đóng
    );

    const toggleSection = (index: number) => {
        setCollapsedSections((prev) => {
            const newCollapsedSections = [...prev];
            newCollapsedSections[index] = !newCollapsedSections[index];
            return newCollapsedSections;
        });
    };

    const expandAll = () => {
        setCollapsedSections(Array(sections.length).fill(false));
    };

    const collapseAll = () => {
        setCollapsedSections(Array(sections.length).fill(true));
    };

    const renderHeader = (section: GuideSection, index: number) => {
        const isActive = !collapsedSections[index];

        return (
            <TouchableOpacity onPress={() => toggleSection(index)} activeOpacity={0.8}>
                <View
                    style={[
                        styles.header,
                        isActive ? styles.highlightedHeader : null,
                        { borderBottomWidth: isActive ? 0 : 1 },
                    ]}
                >
                    <Text style={[styles.title, isActive ? styles.highlightedTitle : null]} numberOfLines={2}>
                        {section.title}
                    </Text>
                    <ChevronIcon isUp={isActive} isHighlighted={isActive} />
                </View>
            </TouchableOpacity>
        );
    };

    const renderContent = (section: GuideSection) => {
        if (Array.isArray(section.content)) {
            return (
                <View style={styles.content}>
                    {section.content.map((item, index) => {
                        if (typeof item === 'string') {
                            return (
                                <View key={index} style={styles.bulletItem}>
                                    <Text style={styles.contentText}>• {item}</Text>
                                </View>
                            );
                        } else {
                            return (
                                <View key={index} style={styles.bulletItem}>
                                    <Text style={styles.contentText}>• {item.content}</Text>
                                    <View className='justify-center items-center w-full mt-3'>
                                        {item.image && (
                                            <ImageComponent
                                                url={item.image}
                                                height={200}
                                                objectFit='contain'
                                                rounded={12}
                                                showImageModal
                                            />
                                        )}
                                    </View>
                                </View>
                            );
                        }
                    })}
                </View>
            );
        } else if (typeof section.content === 'string') {
            return (
                <View style={styles.content}>
                    <Text style={styles.contentText}>{section.content}</Text>
                    <View className='justify-center items-center w-full mt-3 '>
                        {section.image && (
                            <ImageComponent
                                url={section.image}
                                height={200}
                                objectFit='contain'
                                rounded={12}
                                showImageModal
                            />
                        )}
                    </View>
                </View>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                {collapsedSections.every((collapsed) => collapsed) ? (
                    <ButtonComponent
                        title='Mở rộng'
                        type='outline'
                        size='small'
                        icon={<MaterialCommunityIcons name='arrow-expand-vertical' size={24} color='black' />}
                        onPress={expandAll}
                    />
                ) : (
                    <ButtonComponent
                        title='Thu gọn'
                        type='outline'
                        size='small'
                        icon={<MaterialCommunityIcons name='arrow-collapse-vertical' size={24} color='black' />}
                        onPress={collapseAll}
                    />
                )}
            </View>
            {sections.map((section, index) => (
                <View key={index} style={styles.sectionContainer}>
                    {renderHeader(section, index)}
                    <Collapsible collapsed={collapsedSections[index]}>{renderContent(section)}</Collapsible>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    sectionContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomColor: '#e0e0e0',
    },
    highlightedHeader: {
        backgroundColor: '#e6f0ff',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        paddingRight: 10,
        color: colors.text400,
    },
    highlightedTitle: {
        color: colors.primary400,
    },
    content: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    contentText: {
        fontSize: 14,
        color: colors.text400,
        lineHeight: 20,
    },
    bulletItem: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 8,
    },
    bullet: {
        fontSize: 14,
        marginRight: 5,
        lineHeight: 20,
    },
    buttonContainer: {
        position: 'absolute',
        right: 0,
        top: -40,
        zIndex: 1,
        paddingHorizontal: 10,
    },
    button: {
        flexDirection: 'row',
    },
    buttonText: {
        fontWeight: '600',
    },
    image: {
        minWidth: 300,
        width: '100%',
        objectFit: 'contain',
        minHeight: 200,
        borderRadius: 5,
    },
});

export default CollapsibleGuide;
