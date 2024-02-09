import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const MailSlice = createSlice({
    name:'mail',
    initialState:{
        receiver:null,
        mail:[],
        receivedMail:[]
    },
    reducers:{
        addMail:(state,action)=>{
            state.receiver = action.payload.receiver;
            state.mail.push(action.payload);
        },
        setMail:(state,action)=>{
            state.mail = action.payload;
        },
        addReceivedMail: (state, action) => {
            state.receivedMail.push(action.payload);
        },
        setReceivedMail:(state,action)=>{
            state.receivedMail = action.payload;
        }
    }

})

export const { addMail, setMail, addReceivedMail, setReceivedMail } = MailSlice.actions;

export const postMailArrayToFirebase = (emailData,subject,body) => async (dispatch, getState) => {
    const userId = getState().auth.userId; 
    const receiver = getState().mail.receiver;
    console.log(receiver);
    try {
        const response = await axios.post(`https://expense-tracker-e0688-default-rtdb.firebaseio.com/user/${userId}/mails/sended.json`, emailData);

        console.log(response.data);
        console.log(response.data.name);
        const senderKey = response.data.name
    
        const responsePut = await axios.put(`https://expense-tracker-e0688-default-rtdb.firebaseio.com/user/${receiver}/mails/recived/${senderKey}.json`,{
            subject:subject,
            body:body,
            from:userId
        })
        console.log(responsePut.data);
       
    }
    
    
    catch (error) {
        console.error('Error posting mail to Firebase:', error);
    }
};




export default MailSlice.reducer;
