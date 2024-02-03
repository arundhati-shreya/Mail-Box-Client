import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function MailForm() {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleSend = () => {
    const contentState = convertToRaw(editorState.getCurrentContent());
    const body = JSON.stringify(contentState);
    const emailData = {
        recipient,
        subject,
        body,
      };
  

      console.log("Sending email:", emailData);
  
      setRecipient('');
      setSubject('');
      setEditorState(EditorState.createEmpty());
  };

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
                <textarea
                  className="form-control mb-3"
                  rows="6"
                  value={editorState.getCurrentContent().getPlainText()}
                  onChange={(e) => setEditorState(EditorState.createWithText(e.target.value))}
                />
              </div>
              <button className="btn btn-primary mb-3" onClick={handleSend}>Send</button>

                <Editor
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                />
        
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MailForm;
