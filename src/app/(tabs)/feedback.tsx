import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ContainerComponent, InputComponent, SectionComponent, TextComponent } from "@/components";
import { authSelector } from "@/stores/reducers/authReducer";
import { useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";
import feedbackAPI from "@/apis/feedbackApi";

export default function feedback() {
    const { authData } = useSelector(authSelector);
    const [content, setContent] = React.useState("");
    const handleSubmit = () => {
        if (!content) {
            Alert.alert("Gửi góp ý", "Vui lòng nhập nội dung góp ý");
            return;
        }
        Alert.alert("Gửi góp ý", "Bạn có chắc chắn muốn gửi góp ý này?", [
            {
                text: "Hủy",
                onPress: () => {},
                style: "cancel",
            },
            {
                text: "Gửi",
                onPress: async () => {
                    try {
                        const res = await feedbackAPI.submitFeedback({
                            user: authData?._id || "",
                            feedback: content,
                        });
                        if (res) {
                            router.back();
                            Alert.alert("Gửi góp ý", "Gửi góp ý thành công");
                            setContent("");
                        } else {
                            Alert.alert("Gửi góp ý", `Gửi góp ý thất bại`);
                        }
                    } catch (error: any) {
                        Alert.alert("Gửi góp ý", `Gửi góp ý thất bại, ${error}`);
                    }
                },
            },
        ]);
    };
    return (
        <ContainerComponent
            title="Góp ý"
            isScroll
            iconLeft="logo"
            iconRight={
                <TouchableOpacity onPress={handleSubmit}>
                    <TextComponent text="Gửi" size={20} />
                </TouchableOpacity>
            }
        >
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
                <SectionComponent>
                    <InputComponent
                        value={authData?.username ?? ""}
                        onChange={() => {}}
                        labelTop="Mã số sinh viên"
                        readOnly
                    />
                    <InputComponent
                        value={authData?.fullName ?? ""}
                        onChange={() => {}}
                        labelTop="Họ và tên sinh viên"
                        readOnly
                    />
                    <InputComponent value={authData?.sclassName ?? ""} onChange={() => {}} labelTop="Lớp" readOnly />
                    <InputComponent value={"Công nghệ thông tin"} onChange={() => {}} labelTop="Khoa" readOnly />
                    <InputComponent
                        value={content}
                        onChange={setContent}
                        multiline
                        placeholder="Nhập nội dung tại đây"
                        labelTop="Nội dung góp ý"
                        height={130}
                        required
                    />
                </SectionComponent>
            </KeyboardAwareScrollView>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({});
