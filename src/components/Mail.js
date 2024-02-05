import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useDispatch } from 'react-redux';
import { postMailArrayToFirebase, setMail } from '../store/MailSlice';
import { useNavigate } from 'react-router-dom';


function MailForm() {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const dispatch = useDispatch();

  const handleSend = () => {
    const contentState = convertToRaw(editorState.getCurrentContent());
    const body = JSON.stringify(contentState);
    const emailData = {
      recipient,
      subject,
      body,
    };
    dispatch(postMailArrayToFirebase(emailData));


    console.log("Sending email:", emailData);

    setRecipient('');
    setSubject('');
    setEditorState(EditorState.createEmpty());
  };

  const toggleToolbar = () => {
    setToolbarVisible(!toolbarVisible);
  };

  const composeHandler = () => {
    navigate('/inbox')
  }

  return (
    <div className="container-lg mt-5">
      <div className="row">
        <button className="btn btn-primary btn-sm rounded-circle" style={{ width: '50px', height: '40px' }} onClick={composeHandler}>
          <img src='https://i.pinimg.com/474x/38/ce/b6/38ceb6950c4d742430247459ac00a627.jpg' className="img-fluid rounded-circle" alt="Profile" />
        </button>
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
                <div className="toolbar-trigger" onClick={toggleToolbar}>
                  {toolbarVisible ? 'Hide toolbar' : 'Show toolbar'}
                </div>
                {toolbarVisible && (
                  <div className="row">
                    <div className="col">
                      <Editor
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                        wrapperClassName="wrapper-class"
                        editorClassName="editor-class"
                        toolbarClassName="toolbar-class"
                      />
                    </div>
                  </div>
                )}
              </div>
              <button className="btn btn-primary mb-3" onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default MailForm;
