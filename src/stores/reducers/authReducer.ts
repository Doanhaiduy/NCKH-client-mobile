import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

const initialState: AuthState = {
    authData: null,
    OTP: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (
            state,
            action: {
                payload: AuthData;
            },
        ) => {
            state.authData = action.payload;
            AsyncStorage.setItem('auth', JSON.stringify(action.payload));
        },
        setAuth: (state, action) => {
            state.authData = action.payload;
        },
        updateToken: (state, action) => {
            state.authData!.accessToken = action.payload.newAccessToken;
            state.authData!.refreshToken = action.payload.newRefreshToken;
            AsyncStorage.setItem('auth', JSON.stringify(state.authData));
        },
        logout: (state) => {
            AsyncStorage.removeItem('auth');
            state.authData = null;
        },
        removeOTP: (state) => {
            state.OTP = null;
        },
        setOtpValue: (state, action) => {
            state.OTP = action.payload;
            state.OTP!.done = false;
        },
        setDoneVerify: (state) => {
            state.OTP!.done = true;
        },
    },
});

export const authReducer = authSlice.reducer;

export const { login, setAuth, logout, updateToken, removeOTP, setOtpValue, setDoneVerify } = authSlice.actions;

export const authSelector = (state: any): AuthState => state.auth;
