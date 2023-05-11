import { createSlice } from '@reduxjs/toolkit';

export const ConsumerQueryFormReducer = createSlice({
    name: 'ConsumerForm',
    initialState: {
        data: {},
    },
    reducers: {
        ConsumerQueryForm: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { ConsumerQueryForm } = ConsumerQueryFormReducer.actions;

export const ConsumerForm = (state) => state;

export default ConsumerQueryFormReducer.reducer;