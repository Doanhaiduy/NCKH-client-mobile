import { authSelector } from '@/stores/reducers/authReducer';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function Home() {
    const { authData } = useSelector(authSelector);

    useEffect(() => {
        const route = authData && authData.accessToken ? '/(home)/' : '/(auth)/sign-in';
        setTimeout(() => {
            router.navigate(route);
        }, 50);
    }, [authData]);

    return (
        <ImageBackground
            source={require('../../assets/splash-screen.png')}
            className='flex-1 bg-primary-100'
            imageStyle={{
                resizeMode: 'cover',
                flex: 1,
            }}
        ></ImageBackground>
    );
}

const styles = StyleSheet.create({});
