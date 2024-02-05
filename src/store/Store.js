import { configureStore } from "@reduxjs/toolkit";
import mailReducer from './MailSlice'; 
import authReducer from './authSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        mail: mailReducer
    }
});

export default store;
