import { configureStore } from "@reduxjs/toolkit";
import mailReducer from './MailSlice'; 

const store = configureStore({
    reducer: {
        mail: mailReducer,
    }
});

export default store;
