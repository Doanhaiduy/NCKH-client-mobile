import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
import { login, sendOTP } from '../actions/authAction';

const initialState: AuthState = {
    isLoading: false,
    errorMessage: '',
    authData: null,
    userInfo: null,
    OTP: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            AsyncStorage.removeItem('auth');
            state.authData = null;
            state.errorMessage = '';
            state.userInfo = null;
        },
        removeOTP: (state) => {
            state.OTP = null;
        },
        setDoneVerify: (state) => {
            if (state.OTP) {
                state.OTP.done = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
            state.errorMessage = '';
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.authData = action.payload.auth;
            state.userInfo = action.payload.userInfo;
            AsyncStorage.setItem('auth', JSON.stringify(action.payload));
            state.isLoading = false;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.errorMessage = action.payload;
            } else {
                state.errorMessage = action.error.message || 'Có lỗi xảy ra';
            }
        });

        builder.addCase(sendOTP.pending, (state) => {
            state.isLoading = true;
            state.errorMessage = '';
        });
        builder.addCase(sendOTP.fulfilled, (state, action) => {
            state.isLoading = false;
            state.OTP = action.payload;
        });

        builder.addCase(sendOTP.rejected, (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.errorMessage = action.payload;
            } else {
                state.errorMessage = action.error.message || 'Có lỗi xảy ra';
            }
        });
    },
});

export const authReducer = authSlice.reducer;

export const { logout, removeOTP, setDoneVerify } = authSlice.actions;

export const authSelector = (state: any): AuthState => state.auth;
