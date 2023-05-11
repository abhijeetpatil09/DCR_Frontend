import { configureStore } from "@reduxjs/toolkit";
import userReducer1 from './features/userSlice'
import ConsumerQueryFormReducer from './features/QueryFormReducer'

export default configureStore({
    reducer: {
        user: userReducer1,
        ConsumerForm: ConsumerQueryFormReducer
    },
});