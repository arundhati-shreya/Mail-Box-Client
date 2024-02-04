import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Inbox.css"; 

const Inbox = () => {
    const [emails, setEmails] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedEmail, setSelectedEmail] = useState(null); // State to store the details of the selected email
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axios.get('https://expense-tracker-e0688-default-rtdb.firebaseio.com/mail.json');
                const data = response.data;
                if (data && typeof data === 'object') {
                    const emailsArray = Object.entries(data).map(([id, email]) => ({ id, ...email }));
                    setEmails(emailsArray);

                    // Calculate unread count
                    const unread = emailsArray.filter(email => !email.read);
                    setUnreadCount(unread.length);
                } else {
                    console.error("Data received from API is not an object:", data);
                }
            } catch (error) {
                console.error("Error fetching emails:", error);
            }
        };

        fetchEmails();

    }, []);

    const composeHandler = () => {
        navigate('/mail');
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`https://expense-tracker-e0688-default-rtdb.firebaseio.com/mail/${id}.json`, { read: true });
            const updatedEmails = emails.map(email => {
                if (email.id === id) {
                    return { ...email, read: true };
                }
                return email;
            });
            setEmails(updatedEmails);
            setUnreadCount(prevCount => prevCount - 1);
        } catch (error) {
            console.error("Error marking email as read:", error);
        }
    };

    // Function to handle clicking on recipient to toggle email details
    const handleRecipientClick = (email) => {
        setSelectedEmail(prevSelectedEmail => {
            // If the clicked email is already selected, toggle back to null
            return prevSelectedEmail === email ? null : email;
        });
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-3">
                    <div className="list-group">
                        <a href="#" className="list-group-item list-group-item-action active">
                            Inbox ({unreadCount} unread)
                        </a>
                        <a href="#" className="list-group-item list-group-item-action">Sent</a>
                        <a href="#" className="list-group-item list-group-item-action">Drafts</a>
                        <a href="#" className="list-group-item list-group-item-action">Trash</a>
                        
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="card">
                        <div className="card-header">Message</div>
                        {/* Render selected email content here */}
                        {selectedEmail && (
                            <div className="card-body" onClick={() => setSelectedEmail(null)}>
                                <h5 className="card-title">{selectedEmail.recipient}</h5>
                                <p className="mb-1">{selectedEmail.subject}</p>
                                <p className="card-text">{selectedEmail.body}</p>
                            </div>
                        )}
                        {!selectedEmail && (
                            <div className="list-group">
                                {emails.map((email, index) => (
                                    <a key={index} href="#" className={`list-group-item list-group-item-action ${email.read ? '' : 'unread'}`} onClick={() => { markAsRead(email.id); handleRecipientClick(email); }}>
                                        <span className="dot"></span>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">{email.recipient}</h6>
                                                <p className="mb-1">{email.subject}</p>
                                                
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <button className="btn btn-primary btn-sm rounded-circle" style={{ width: '50px', height: '40px' }} onClick={composeHandler}>
                <img src='https://i.pinimg.com/736x/f4/b9/3a/f4b93a502f60397fe92b663ddb9e683d.jpg' className="img-fluid rounded-circle" alt="Profile" />
            </button>
        </div>
    );
};

export default Inbox;
