import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDispatch } from "react-redux";
import { addMail, postMailArrayToFirebase } from "../stores/MailSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../stores/authSlice";

import { MdForwardToInbox } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";

function MailForm() {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
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
    dispatch(addMail({ receiver }));
    console.log("addMail", addMail);
    console.log("recipent", recipient);
    console.log("receiver", receiver);
    dispatch(postMailArrayToFirebase(emailData, subject, body));

    console.log("Sending email:", emailData);

    setRecipient("");
    setSubject("");
    setEditorState(EditorState.createEmpty());
  };

  const composeHandler = () => {
    navigate("/inbox");
  };

  const LogOutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
  
          <div
          className="card"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", marginLeft: '10rem', marginRight: '10rem',marginTop:'2.5rem' }}
          >
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
                <div
                  className="row"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
                >
                  <div className="col">
                    <Editor
                      toolbar={{
                        options: [
                          "inline",
                          "blockType",
                          "fontSize",
                          "fontFamily",
                          "list",
                          "textAlign",
                          "colorPicker",
                          "link",
                          "embedded",
                          "emoji",
                          "image",
                          "remove",
                        ],
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
                      editorStyle={{ minHeight: "200px" }}
                      placeholder="Write your message here..."
                    />
                  </div>
                </div>
              </div>
              <button className="btn btn-primary mb-3" onClick={handleSend}>
                Send
              </button>
              <div className="d-flex justify-content-end mt-1">
                <button
                  className="btn btn-info btn-sm rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                  onClick={composeHandler}
                >
                  <MdForwardToInbox size={24} />{" "}
                </button>
              </div>
            </div>
            <div className="fixed-top p-3 d-flex justify-content-end">
              <button
                className="btn btn-light btn-sm rounded-circle"
                style={{ width: "50px", height: "50px" }}
                onClick={LogOutHandler}
              >
                <IoMdLogOut size={24}/>
              </button>
            </div>
          </div>
    
  );
}

export default MailForm;
