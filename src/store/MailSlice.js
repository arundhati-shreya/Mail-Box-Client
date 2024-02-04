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

export const postMailArrayToFirebase = () => async (dispatch, getState) => {
    const { mail } = getState().mail;
    try {
        // Perform the POST request to Firebase
        const response = await axios.post('https://expense-tracker-e0688-default-rtdb.firebaseio.com/mail.json', mail);

        // Dispatch action to update Redux state
        dispatch(addMail(response.data));
    } catch (error) {
        console.error('Error posting mail to Firebase:', error);
    }
};


export default MailSlice.reducer;
