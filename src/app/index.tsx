import { setAuth } from '@/stores/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, Redirect, router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

export default function Home() {
    const dispatch = useDispatch();

    const checkAuth = async () => {
        const auth = await AsyncStorage.getItem('auth');
        console.log('auth', auth);
        if (auth) {
            const authData = JSON.parse(auth);
            dispatch(setAuth(authData));
            router.navigate('(home)/');
        } else {
            router.navigate('(auth)/sign-in');
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <View>
            <Text>Home</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
