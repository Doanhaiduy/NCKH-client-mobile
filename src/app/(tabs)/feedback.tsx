import { Alert, TouchableOpacity } from 'react-native';
import React from 'react';
import { ContainerComponent, InputComponent, SectionComponent, TextComponent } from '@/components';
import { authSelector } from '@/stores/reducers/authReducer';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import feedbackAPI from '@/apis/feedbackApi';
import { useTranslation } from 'react-i18next';

export default function Feedback() {
    const { t } = useTranslation();
    const { authData } = useSelector(authSelector);
    const [content, setContent] = React.useState('');

    const handleSubmit = () => {
        if (!content) {
            Alert.alert(t('feedback.submit_title'), t('feedback.empty_content_message'));
            return;
        }
        Alert.alert(t('feedback.submit_title'), t('feedback.confirm_message'), [
            {
                text: t('feedback.cancel_button'),
                onPress: () => {},
                style: 'cancel',
            },
            {
                text: t('feedback.submit_button'),
                onPress: async () => {
                    try {
                        const res = await feedbackAPI.submitFeedback({
                            user: authData?._id || '',
                            feedback: content,
                        });
                        if (res) {
                            router.back();
                            Alert.alert(t('feedback.submit_title'), t('feedback.success_message'));
                            setContent('');
                        } else {
                            Alert.alert(t('feedback.submit_title'), t('feedback.failure_message'));
                        }
                    } catch (error: any) {
                        Alert.alert(
                            t('feedback.submit_title'),
                            t('feedback.failure_message_with_error').replace('{error}', error.toString()),
                        );
                    }
                },
            },
        ]);
    };

    return (
        <ContainerComponent
            title={t('feedback.title')}
            isScroll
            iconLeft='logo'
            iconRight={
                <TouchableOpacity onPress={handleSubmit}>
                    <TextComponent text={t('feedback.submit_button')} size={20} />
                </TouchableOpacity>
            }
        >
            <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
                <SectionComponent>
                    <InputComponent
                        value={authData?.username ?? ''}
                        onChange={() => {}}
                        labelTop={t('feedback.student_id_label')}
                        readOnly
                    />
                    <InputComponent
                        value={authData?.fullName ?? ''}
                        onChange={() => {}}
                        labelTop={t('feedback.full_name_label')}
                        readOnly
                    />
                    <InputComponent
                        value={authData?.sclassName ?? ''}
                        onChange={() => {}}
                        labelTop={t('feedback.class_label')}
                        readOnly
                    />
                    <InputComponent
                        value={'Công nghệ thông tin'}
                        onChange={() => {}}
                        labelTop={t('feedback.faculty_label')}
                        readOnly
                    />
                    <InputComponent
                        value={content}
                        onChange={setContent}
                        multiline
                        placeholder={t('feedback.content_placeholder')}
                        labelTop={t('feedback.content_label')}
                        height={130}
                        required
                    />
                </SectionComponent>
            </KeyboardAwareScrollView>
        </ContainerComponent>
    );
}
