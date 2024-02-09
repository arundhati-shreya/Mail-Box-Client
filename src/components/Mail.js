import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useDispatch } from 'react-redux';
import { addMail, postMailArrayToFirebase } from '../stores/MailSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../stores/authSlice';


function MailForm() {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const dispatch = useDispatch();

  const handleSend = () => {

    if (!recipient || !subject || !editorState.getCurrentContent().hasText()) {
      // If any of the fields are empty, return without submitting
      return;
    }

    const contentState = convertToRaw(editorState.getCurrentContent());
    const body = JSON.stringify(contentState);
    const emailData = {
      recipient,
      subject,
      body,
    };
    const receiver = recipient.replace(/[^a-zA-Z0-9\s]/g, "");
    dispatch(addMail({ receiver }))
    console.log('addMail', addMail);
    console.log('recipent', recipient);
    console.log('receiver', receiver);
    dispatch(postMailArrayToFirebase(emailData, subject, body));



    console.log("Sending email:", emailData);

    setRecipient('');
    setSubject('');
    setEditorState(EditorState.createEmpty());
  };



  const composeHandler = () => {
    navigate('/inbox')
  }

  const LogOutHandler = () => {
    dispatch(logout());
    navigate('/')
  }


  return (
    <div className="container-lg mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="recipient">To:</label>
                <input
                  type="email"
                  className="form-control mb-3"
                  id="recipient"
                  placeholder="Recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject:</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  id="subject"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="body">Body:</label>
                <div className="row">
                  <div className="col">
                    <Editor
                      toolbar={{
                        options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove'],
                        inline: { inDropdown: true },
                        blockType: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: false },

                      }}
                      editorState={editorState}
                      onEditorStateChange={setEditorState}
                      wrapperClassName="wrapper-class"
                      editorClassName="editor-class"
                      toolbarClassName="toolbar-class"
                      editorStyle={{ minHeight: '200px' }}
                      placeholder="Write your message here..."
                    />
                  </div>
                </div>
              </div>
              <button className="btn btn-primary mb-3" onClick={handleSend}>Send</button>
              <div className="d-flex justify-content-end mt-1">
                <button className="btn btn-primary btn-sm rounded-circle" style={{ width: '50px', height: '40px' }} onClick={composeHandler}>
                  <img src='https://www.shutterstock.com/shutterstock/photos/1130581295/display_1500/stock-vector-inbox-icon-vector-illustration-flat-design-style-vector-inbox-icon-illustration-isolated-on-white-1130581295.jpg' className="img-fluid rounded-circle" alt="Profile" />
                </button>
              </div>
            </div>
            <div className="fixed-top p-3 d-flex justify-content-end">
              <button className="btn btn-primary btn-sm rounded-circle" style={{ width: '50px', height: '50px' }} onClick={LogOutHandler}>
                <img src='https://cdn.vectorstock.com/i/1000x1000/23/83/logout-icon-vector-22882383.webp' className="img-fluid rounded-circle" alt="Profile" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default MailForm;

