import { View, Image, TouchableOpacity, Alert } from "react-native";
import React, { useCallback, useState } from "react";

import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { ImageModal } from "@/modals";
import { useImage } from "@/hooks/useImage";
interface Props {
    url: string;
    width?: number;
    height?: number;
    imageClass?: string;
    rounded?: number;
    aspectRatio?: number;
    showImageModal?: boolean;
}

const ImageComponent = (props: Props) => {
    const { url, width, height, imageClass, showImageModal = false, rounded = 0 } = props;

    const [isShowModal, setIsShowModal] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);

    const { imageUri, loading, error, retry } = useImage(url);

    const openModal = () => {
        console.log("openModal");
        if (!isShowModal) setIsShowModal(true);
    };

    const handleDownload = async () => {
        try {
            setIsDownloaded(true);
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access media library is required!");
                return;
            }

            const file = await FileSystem.downloadAsync(url, FileSystem.documentDirectory + "image.jpg");

            const asset = await MediaLibrary.createAssetAsync(file.uri);
            await MediaLibrary.createAlbumAsync("Download", asset, false);
            Alert.alert("Tải ảnh thành công", "Ảnh đã được tải xuống thư viện ảnh của bạn");
        } catch (error) {
            console.log(error);
        } finally {
            setIsDownloaded(false);
        }
    };

    const containerStyles = `${height ? `h-[${height}px]` : "h-auto"} ${imageClass}`;

    const Wrapper = showImageModal ? TouchableOpacity : View;

    return (
        <Wrapper
            style={{
                width: width || "100%",
                backgroundColor: "#f0f0f0",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: rounded,
                aspectRatio: props.aspectRatio,
            }}
            onPress={() => {
                openModal();
            }}
            className={containerStyles}
        >
            {!imageUri ? (
                <Image
                    source={{
                        uri: "https://i.ibb.co/Tg5fP9v/screenshot-1728441269.png",
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: rounded,
                    }}
                    resizeMode="cover"
                />
            ) : (
                <Image
                    source={{
                        uri: imageUri || "https://i.ibb.co/Tg5fP9v/screenshot-1728441269.png",
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: rounded,
                    }}
                    resizeMode="cover"
                />
            )}
            {isShowModal && imageUri && (
                <ImageModal
                    url={imageUri || "https://i.ibb.co/Tg5fP9v/screenshot-1728441269.png"}
                    rounded={rounded}
                    isShowModal={isShowModal}
                    onClose={() => setIsShowModal(false)}
                    onDownload={handleDownload}
                />
            )}
        </Wrapper>
    );
};

export default ImageComponent;
