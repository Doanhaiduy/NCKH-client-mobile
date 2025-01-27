import { View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';

import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { ImageModal } from '@/modals';
import { useImage } from '@/hooks/useImage';
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
        console.log('openModal');
        if (!isShowModal) setIsShowModal(true);
    };

    const handleDownload = async () => {
        try {
            setIsDownloaded(true);
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access media library is required!');
                return;
            }

            const file = await FileSystem.downloadAsync(url, FileSystem.documentDirectory + 'image.jpg');

            const asset = await MediaLibrary.createAssetAsync(file.uri);
            await MediaLibrary.createAlbumAsync('Download', asset, false);
            Alert.alert('Tải ảnh thành công', 'Ảnh đã được tải xuống thư viện ảnh của bạn');
        } catch (error) {
            console.log(error);
        } finally {
            setIsDownloaded(false);
        }
    };

    const Wrapper = showImageModal ? TouchableOpacity : View;

    return (
        <Wrapper
            style={{
                width: width || '100%',
                backgroundColor: '#f0f0f0',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: rounded,
                ...(height && { height: height }),
                ...(props.aspectRatio && { aspectRatio: props.aspectRatio }),
            }}
            onPress={() => {
                openModal();
            }}
            className={imageClass}
        >
            {!imageUri ? (
                <Image
                    source={{
                        uri: 'https://firebasestorage.googleapis.com/v0/b/snap-share-78f51.appspot.com/o/post%2F%C4%90o%C3%A0n%20H%E1%BA%A3i%20Duy%2F0ef97e94-e5ee-4405-b1ed-afc06f985f8e%2Ffallback.png0ef97e94-e5ee-4405-b1ed-afc06f985f8e?alt=media&token=388d0ebf-9824-4532-a790-d04ec1baaf5d',
                    }}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: rounded,
                    }}
                    resizeMode="cover"
                />
            ) : (
                <Image
                    source={{
                        uri:
                            imageUri ||
                            'https://firebasestorage.googleapis.com/v0/b/snap-share-78f51.appspot.com/o/post%2F%C4%90o%C3%A0n%20H%E1%BA%A3i%20Duy%2F0ef97e94-e5ee-4405-b1ed-afc06f985f8e%2Ffallback.png0ef97e94-e5ee-4405-b1ed-afc06f985f8e?alt=media&token=388d0ebf-9824-4532-a790-d04ec1baaf5d',
                    }}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: rounded,
                    }}
                    resizeMode="cover"
                />
            )}
            {isShowModal && imageUri && (
                <ImageModal
                    url={
                        imageUri ||
                        'https://firebasestorage.googleapis.com/v0/b/snap-share-78f51.appspot.com/o/post%2F%C4%90o%C3%A0n%20H%E1%BA%A3i%20Duy%2F0ef97e94-e5ee-4405-b1ed-afc06f985f8e%2Ffallback.png0ef97e94-e5ee-4405-b1ed-afc06f985f8e?alt=media&token=388d0ebf-9824-4532-a790-d04ec1baaf5d'
                    }
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
