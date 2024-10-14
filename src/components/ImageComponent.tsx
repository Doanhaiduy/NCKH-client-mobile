import { View, Text, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';

interface Props {
    url: string;
    width?: number;
    height?: number;
    imageClass?: string;
    rounded?: number;
    aspectRatio?: number;
}

const ImageComponent = (props: Props) => {
    const { url, width, height, imageClass, rounded = 0 } = props;
    const [imageUrl, setImageUrl] = useState(url);

    useEffect(() => {
        setImageUrl(url);
    }, [url]);

    return (
        <View
            style={{
                width: width || '100%',
                backgroundColor: '#f0f0f0',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: rounded,
                aspectRatio: props.aspectRatio,
            }}
            className={`${height ? 'h-[' + height + 'px]' : 'h-auto'} ${imageClass}`}
        >
            <Image
                source={{
                    uri: imageUrl,
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: rounded,
                }}
                resizeMode="cover"
                onError={() => {
                    setImageUrl('https://i.ibb.co/Tg5fP9v/screenshot-1728441269.png');
                }}
            />
        </View>
    );
};

export default ImageComponent;
