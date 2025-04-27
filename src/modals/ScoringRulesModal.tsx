import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { useTranslation } from 'react-i18next';

export type ScoringRules = {
    condition: string;
    description: string;
    scoreValue: number;
};

export interface ScoringResult {
    selectedCondition: string;
    selectedScoreValue: number;
    inputCount?: number;
}

export interface PopupProps {
    scoringRules: ScoringRules[];
    hasCount: boolean;
    visible: boolean;
    onClose: () => void;
    onSubmit: (result: ScoringResult) => void;
    title?: string;
    submitLabel?: string;
    maxScore?: number;
    evidenceScore?: number;
    conditionsSelected?: string;
    countSelected?: number;
}

const RadioButton = ({ selected }: { selected: boolean }) => {
    return <View style={styles.radioOuterCircle}>{selected ? <View style={styles.radioInnerCircle} /> : null}</View>;
};

const ScoringRulesModal: React.FC<PopupProps> = ({
    scoringRules,
    hasCount,
    visible,
    onClose,
    onSubmit,
    title,
    submitLabel,
    maxScore,
    evidenceScore,
    conditionsSelected,
    countSelected,
}) => {
    const { t } = useTranslation();
    const [selectedRuleIndex, setSelectedRuleIndex] = useState<number | null>(null);
    const [count, setCount] = useState<string>('');
    const [countError, setCountError] = useState<string>('');

    useEffect(() => {
        if (visible) {
            if (conditionsSelected) {
                const selectedIndex = scoringRules.findIndex((rule) => rule.condition === conditionsSelected);
                setSelectedRuleIndex(selectedIndex !== -1 ? selectedIndex : null);
            } else {
                setSelectedRuleIndex(null);
            }
            if (countSelected) {
                setCount(countSelected.toString());
            } else {
                setCount('');
            }
            setCountError('');
        }
    }, [visible]);

    const validateCount = (value: string) => {
        const numericValue = value.trim();

        if (numericValue === '') {
            setCountError(t('scoring_rules.count_required'));
            return false;
        }

        const numberValue = Number(numericValue);

        if (numberValue < 1) {
            setCountError(t('scoring_rules.count_greater_than_zero'));
            return false;
        }
        if (isNaN(numberValue)) {
            setCountError(t('scoring_rules.enter_valid_number'));
            return false;
        }

        if (scoringRules.length > 0 && selectedRuleIndex !== null) {
            const selectedRule = scoringRules[selectedRuleIndex];
            // if (numberValue * selectedRule.scoreValue > maxScore!) {
            //     setCountError(t('scoring_rules.count_exceeds_max_score', { maxScore }));
            //     return false;
            // }
        } else {
            // if (numberValue * evidenceScore! > maxScore!) {
            //     setCountError(t('scoring_rules.count_exceeds_max_score', { maxScore }));
            //     return false;
            // }
        }

        setCountError('');
        return true;
    };

    const handleCountChange = (value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setCount(numericValue);

        if (numericValue) {
            validateCount(numericValue);
        } else {
            setCountError('');
        }
    };

    const handleSubmit = () => {
        if (scoringRules.length > 0 && selectedRuleIndex === null) {
            return;
        }

        if (hasCount && !validateCount(count)) {
            return;
        }
        const result: ScoringResult = {
            selectedCondition: scoringRules.length > 0 ? scoringRules[selectedRuleIndex!].condition : '',
            selectedScoreValue:
                scoringRules.length > 0 ? scoringRules[selectedRuleIndex!].scoreValue : evidenceScore || 0,
        };

        if (hasCount) {
            result.inputCount = parseInt(count, 10);
        }

        onSubmit(result);
    };

    const handleBackdropPress = () => {
        onClose();
    };

    const isSubmitDisabled = () => {
        if (scoringRules.length === 0 && hasCount) {
            return count.trim() === '' || countError !== '';
        }

        if (scoringRules.length > 0 && selectedRuleIndex === null) return true;
        if (hasCount && (count.trim() === '' || countError !== '')) return true;
        return false;
    };

    return (
        <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={handleBackdropPress}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.keyboardAvoidingView}
                        >
                            <View style={styles.popupContainer}>
                                <View style={styles.headerContainer}>
                                    <Text style={styles.title}>{t('scoring_rules.title')}</Text>
                                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <Text style={styles.closeButtonText}>✕</Text>
                                    </TouchableOpacity>
                                </View>

                                <ScrollView style={styles.scrollContent}>
                                    <Text style={styles.countLabel}>{`- (${title})`}</Text>
                                    {scoringRules.map((rule, index) => (
                                        <TouchableOpacity
                                            key={`rule-${index}`}
                                            style={styles.radioItem}
                                            onPress={() => setSelectedRuleIndex(index)}
                                        >
                                            <RadioButton selected={selectedRuleIndex === index} />
                                            <Text style={styles.radioLabel}>{rule.description}</Text>
                                        </TouchableOpacity>
                                    ))}

                                    {hasCount && (
                                        <View style={styles.countContainer}>
                                            <Text style={styles.countLabel}>{t('scoring_rules.enter_count')}</Text>
                                            <TextInput
                                                style={[styles.countInput, countError ? styles.inputError : null]}
                                                value={count}
                                                onChangeText={handleCountChange}
                                                keyboardType='numeric'
                                                placeholder={t('scoring_rules.enter_number')}
                                            />
                                            {countError ? <Text style={styles.errorText}>{countError}</Text> : null}
                                        </View>
                                    )}
                                </ScrollView>

                                <TouchableOpacity
                                    style={[
                                        styles.submitButton,
                                        isSubmitDisabled() ? styles.submitButtonDisabled : null,
                                    ]}
                                    onPress={handleSubmit}
                                    disabled={isSubmitDisabled()}
                                >
                                    <Text style={styles.submitButtonText}>
                                        {submitLabel || t('scoring_rules.submit')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    keyboardAvoidingView: {
        width: '100%',
        maxWidth: 500,
    },
    popupContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: '#666',
    },
    scrollContent: {
        maxHeight: 400,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    radioOuterCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInnerCircle: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#007AFF',
    },
    radioLabel: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },
    countContainer: {
        marginTop: 16,
        marginBottom: 8,
    },
    countLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    countInput: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        marginTop: 4,
        fontSize: 12,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    submitButtonDisabled: {
        backgroundColor: '#A0A0A0',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ScoringRulesModal;
