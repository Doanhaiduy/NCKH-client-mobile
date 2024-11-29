import { useState, useEffect, useCallback } from 'react';
import { Image } from 'react-native';

interface UseImageResult {
    imageUri: string | null;
    loading: boolean;
    error: boolean;
    retry: () => void;
}

export const useImage = (url: string): UseImageResult => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const loadImage = useCallback(() => {
        setLoading(true);
        setError(false);

        Image.prefetch(url)
            .then(() => {
                setImageUri(url);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [url]);

    useEffect(() => {
        loadImage();
    }, [loadImage]);

    return { imageUri, loading, error, retry: loadImage };
};
