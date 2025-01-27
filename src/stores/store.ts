import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/authReducer';
import { refreshReducer } from './reducers/refreshReducer';

const store = configureStore({
    reducer: {
        auth: authReducer,
        refresh: refreshReducer,
    },
});

export default store;
