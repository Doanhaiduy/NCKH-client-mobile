// import { AuthType } from '@/types/Auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
    id: '',
    email: '',
    accessToken: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authData: initialState,
    },
    reducers: {
        setAuthData: (state, action) => {
            state.authData = action.payload;
        },
        logout: (state) => {
            // AsyncStorage.removeItem('auth');
            state.authData = initialState;
        },
    },
});

export const authReducer = authSlice.reducer;
export const { setAuthData, logout } = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.authData;
