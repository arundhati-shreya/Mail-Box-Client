import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Inbox = () => {
    const [emails, setEmails] = useState([]); // Initialize emails state as an empty array
    const navigate = useNavigate(); // Renamed Navigate to navigate, as per convention

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axios.get('https://expense-tracker-e0688-default-rtdb.firebaseio.com/mail.json');
                const data = response.data;
                // Ensure data is an object before updating emails state
                if (data && typeof data === 'object') {
                    const emailsArray = Object.values(data); // Convert object values to array
                    setEmails(emailsArray);
                } else {
                    console.error("Data received from API is not an object:", data);
                }
            } catch (error) {
                console.error("Error fetching emails:", error);
            }
        };

        fetchEmails(); // Call the fetchEmails function

    }, []);

    const composeHandler = () => {
        navigate('/mail');
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-3">
                    <div className="list-group">
                        <a href="#" className="list-group-item list-group-item-action active">
                            Inbox
                        </a>
                        <a href="#" className="list-group-item list-group-item-action">Sent</a>
                        <a href="#" className="list-group-item list-group-item-action">Drafts</a>
                        <a href="#" className="list-group-item list-group-item-action">Trash</a>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="card">
                        <div className="card-header">Inbox</div>
                        <ul className="list-group list-group-flush">
                            {/* Map through the emails state to render email items */}
                            {emails.map((email, index) => (
                                <li key={index} className="list-group-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="mb-1">Email Subject: {email.subject}</h5>
                                            <p className="mb-1">Recipient: {email.recipient}</p>
                                        </div>
                                    </div>
                                    <p className="mb-1">Body: {email.body}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <button className="btn btn-primary btn-sm rounded-circle" style={{ width: '50px', height: '40px' }} onClick={composeHandler}>
                <img src='https://i.pinimg.com/736x/f4/b9/3a/f4b93a502f60397fe92b663ddb9e683d.jpg' className="img-fluid rounded-circle" alt="Profile"/>
            </button>
        </div>
    );
};

export default Inbox;
