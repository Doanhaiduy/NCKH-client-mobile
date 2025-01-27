import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { set } from 'date-fns';

interface RefreshState {
    eventNeedsRefresh: boolean;
    postNeedsRefresh: boolean;
    trainingPointRefresh: boolean;
}

const initialState: RefreshState = {
    eventNeedsRefresh: false,
    postNeedsRefresh: false,
    trainingPointRefresh: false,
};

const refreshSlice = createSlice({
    name: 'refresh',
    initialState,
    reducers: {
        setEventNeedsRefresh(state, action: PayloadAction<boolean>) {
            state.eventNeedsRefresh = action.payload;
        },
        setPostNeedsRefresh(state, action: PayloadAction<boolean>) {
            state.postNeedsRefresh = action.payload;
        },
        setTrainingPointRefresh(state, action: PayloadAction<boolean>) {
            state.trainingPointRefresh = action.payload;
        },
        resetRefreshEventFlag(state) {
            state.eventNeedsRefresh = false;
        },
        resetRefreshPostFlag(state) {
            state.postNeedsRefresh = false;
        },
        resetRefreshTrainingPointFlag(state) {
            state.trainingPointRefresh = false;
        },
    },
});

export const {
    setEventNeedsRefresh,
    setPostNeedsRefresh,
    setTrainingPointRefresh,
    resetRefreshEventFlag,
    resetRefreshPostFlag,
    resetRefreshTrainingPointFlag,
} = refreshSlice.actions;
export const refreshSelector = (state: any): RefreshState => state.refresh;
export const refreshReducer = refreshSlice.reducer;
