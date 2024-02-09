import { configureStore } from "@reduxjs/toolkit";
import mailReducer from './MailSlice'; 
import authReducer from './authSlice'

const Store = configureStore({
    reducer: {
        auth: authReducer,
        mail: mailReducer
    }
});

export default Store;
