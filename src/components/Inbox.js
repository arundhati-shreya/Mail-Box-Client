import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Inbox.css";
import { useDispatch, useSelector } from "react-redux";
import { setReceivedMail } from "../stores/MailSlice";
import { logout } from "../stores/authSlice";
import useFetchEmails from "../Hooks/Use-Fetch-Emails";
import { Editor,convertFromRaw, EditorState } from "draft-js";

const Inbox = () => {
    const receivedMail = useSelector((state) => state.mail.receivedMail) || [];

    const userId = useSelector(state => state.auth.userId)
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty()); 
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useFetchEmails(
        userId,
        `https://expense-tracker-e0688-default-rtdb.firebaseio.com/user/${userId}/mails/recived.json`,
        setReceivedMail
       
    )

    useEffect(() => {
        const unread = receivedMail.filter(email => !email.read);
        setUnreadCount(unread.length);
      
    }, [receivedMail]);


    // useEffect(() => {
    //     const fetchEmails = async () => {
    //         try {
    //             const response = await axios.get(`https://expense-tracker-e0688-default-rtdb.firebaseio.com/user/${userId}/mails/recived.json`);

    //             if (response.status === 200) {
    //                 const data = response.data;

    //                 const emailsArray = Object.entries(data).map(([id, email]) => ({ id, ...email }));
    //                 // console.log(emailsArray);
                   
    //                 dispatch(setReceivedMail(emailsArray))
    //                 const unread = emailsArray.filter(email => !email.read);
    //                 setUnreadCount(unread.length);
    //             }

    //         } catch (error) {
    //             console.error("Error fetching emails:", error);
    //         }
    //     };
    //     const intervalId = setInterval(fetchEmails, 2000); 

    //     return () => clearInterval(intervalId); 
    // }, [dispatch, userId]);


    const composeHandler = () => {
        navigate('/mail');
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`https://expense-tracker-e0688-default-rtdb.firebaseio.com/user/${userId}/mails/recived/${id}.json`, { read: true });
            const updatedEmails = receivedMail.map(email => {
                if (email.id === id) {
                    return { ...email, read: true };
                }
                return email;
            });
            dispatch(setReceivedMail(updatedEmails));
            setUnreadCount(prevCount => Math.max(0, prevCount - 1));

        } catch (error) {
            console.error("Error marking email as read:", error);
        }
    };

    const handleRecipientClick = (email) => {
        setSelectedEmail(prevSelectedEmail => {
            return prevSelectedEmail === email ? null : email;
        });
        if (email && email.body) {
            const content = JSON.parse(email.body); 
            const contentState = convertFromRaw(content); 
            const editorState = EditorState.createWithContent(contentState); 
            setEditorState(editorState); 
        } else {
            setEditorState(EditorState.createEmpty()); 
        }

    };

    const deleteEmail = async (event, id) => {
        event.stopPropagation()
        try {
            await axios.delete(`https://expense-tracker-e0688-default-rtdb.firebaseio.com/user/${userId}/mails/recived/${id}.json`);

            dispatch(setReceivedMail(receivedMail.filter(email => email.id !== id)));
            
            if (selectedEmail && selectedEmail.id === id) {
                setSelectedEmail(null);
            }
        } catch (error) {
            console.error("Error deleting email:", error);
        }
    };

    const LogOutHandler = () => {
        dispatch(logout());
        navigate('/')
    }

    return (
        <div className="container mt-4">

            <div className="row">
                <div className="col-md-3">
                    <div className="list-group">
                        <Link className="list-group-item list-group-item-action active" to='/inbox'>
                            Inbox ({unreadCount} unread)
                        </Link>
                        <Link className="list-group-item list-group-item-action" to='/sent'>Sent </Link>
                        <p className="list-group-item list-group-item-action">Drafts</p>
                        <p className="list-group-item list-group-item-action">Trash</p>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="card">
                        <div className="card-header">Message</div>

                        {selectedEmail && (
                            <div className="card-body" onClick={() => setSelectedEmail(null)}>
                                <h5 className="card-title">{selectedEmail.recipient}</h5>
                                <p className="mb-1">{selectedEmail.subject}</p>
                                <div className="editor-container">
                                    <Editor editorState={editorState} readOnly={true} />
                                </div>
                            </div>
                        )}


                        {!selectedEmail && (
                            <div className="list-group">
                                {receivedMail.map((email, index) => (
                                    <div key={index} className={`list-group-item list-group-item-action ${email.read ? '' : 'unread'}`} onClick={() => { handleRecipientClick(email); markAsRead(email.id) }}>
                                        <span className="dot"></span>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">{email.from}</h6>
                                                <p className="mb-1">{email.subject} </p>
                                            </div>
                                            <button className="btn btn-danger btn-sm" onClick={(event) => deleteEmail(event, email.id)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <button className="btn btn-primary btn-sm rounded-circle" style={{ width: '50px', height: '40px' }} onClick={composeHandler}>
                <img src='https://i.pinimg.com/736x/f4/b9/3a/f4b93a502f60397fe92b663ddb9e683d.jpg' className="img-fluid rounded-circle" alt="Profile" />
            </button>

            <div className="fixed-top p-3 d-flex justify-content-end">
                <button className="btn btn-primary btn-sm rounded-circle" style={{ width: '50px', height: '50px' }} onClick={LogOutHandler}>
                    <img src='https://cdn.vectorstock.com/i/1000x1000/23/83/logout-icon-vector-22882383.webp' className="img-fluid rounded-circle" alt="Profile" />
                </button>
            </div>
        </div>
    );
};

export default Inbox;
