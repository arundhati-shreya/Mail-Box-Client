import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const MailSlice = createSlice({
    name:'mail',
    initialState:{
        mail:[]
    },
    reducers:{
        addMail:(state,action)=>{
            state.mail.push(action.payload);
        },
        setMail:(state,action)=>{
            state.mail = action.payload;
        }
    }

})

export const { addMail, setMail } = MailSlice.actions;

export const postMailArrayToFirebase = (emailData) => async (dispatch, getState) => {
    const userId = getState().auth.userId; 
    try {
        const response = await axios.post(`https://expense-tracker-e0688-default-rtdb.firebaseio.com/mail/${userId}.json`, emailData);

        console.log(response.data);
        dispatch(addMail(response.data));
    } catch (error) {
        console.error('Error posting mail to Firebase:', error);
    }
};


export default MailSlice.reducer;
