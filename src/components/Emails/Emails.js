import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Emails.css";
import $ from "jquery";
import EmojiPickerModal from "../Modals/EmojiPickerModal";
import axios from "axios";
import Select from "react-select";
import TemplateModal from "../Modals/TemplateModal";
import DateFormat from "dateformat";
import CreateGroupModal from "./Modals/CreateGroupModal";
import DeleteGroupModal from "./Modals/DeleteGroupModal";
import TimerModal from "./TimerModal";

const Emails = () => {
  const location = useLocation();
  const user = location.state.user;
  const [connections, setConnections] = useState(location.state.connections);
  const [modal, setModal] = useState({
    isShown: false,
    ModalTitle: "",
    ModalBody: "",
  });
  const [allEmails, setAllEmails] = useState([]);

  const [showMenu, setShowMenu] = useState(false);
  const [showNewMail, setShowNewMail] = useState(false);
  const [showInbox, setShowInbox] = useState(true);
  const [showSent, setShowSent] = useState(false);
  const [timerModal, setTimerModal] = useState({ isShown: false });
  const [emojiText, setEmojiText] = useState("");
  const [emojiPickerModal, setEmojiPickerModal] = useState({
    isShown: false,
  });

  const [newMailBody, setNewMailBody] = useState("");
  const [newMailAttachments, setNewMailAttachments] = useState([]);
  const [toEmails, setToEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [createGroupModal, setCreateGroupModal] = useState({ isShown: false });
  const [deleteGroupModal, setDeleteGroupModal] = useState({
    isShown: false,
    allgroups: [],
  });
  const [sentMails, setSentMails] = useState([]);
  const [inboxMails, setInboxMails] = useState(location.state.inboxMails);

  //Effects
  useEffect(() => {
    setAllEmails(
      connections.map((connection) => {
        return {
          value: connection.email,
          label: connection.email,
          isGroup: connection.isGroup,
        };
      })
    );
  }, [connections]);

  //Styles
  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "var(--templateColor2)",
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      borderColor: state.isFocused
        ? "var(--templateColor1)"
        : "var(--templateColor2)",
      boxShadow: state.isFocused ? null : null,
      "&:hover": { backgroundColor: "var(--templateColor3)" },
    }),
    option: (base) => ({
      ...base,
      backgroundColor: "var(--templateColor1)",
      color: "var(--logoTextColor)",
      "&:hover": {
        backgroundColor: "var(--templateColor3)",
        color: "var(--logoBgColor)",
      },
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: "var(--logoTextColor)",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      background: "var(--templateColor1)",
      color: "var(--logoTextColor)",
      padding: 0,
    }),
    placeholder: (base) => ({
      ...base,
      color: "var(--logoTextColor)",
      fontWeight: "bold",
    }),
    multiValue: (base) => ({
      ...base,
      background: "var(--templateColor1)",
      color: "var(--logoTextColor)",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "var(--logoTextColor)",
    }),
    input: (base) => ({
      ...base,
      color: "var(--logoTextColor)",
    }),
  };

  //Handlers

  const sendMailHandler = async () => {
    if (toEmails.length == 0) {
      setModal({
        isShown: true,
        ModalTitle: "Empty Recipients",
        ModalBody: "Please choose some Recipients to send mail to.",
      });
      return;
    }

    const date = DateFormat(new Date(), "yyyy-mm-dd");
    const time = DateFormat(new Date(), "HH:MM");

    const formData = new FormData();
    for (let i = 0; i < newMailAttachments.length; i++) {
      formData.append("customfiles", newMailAttachments[i]);
    }
    formData.append("email", user.email);
    formData.append(
      "toemails",
      JSON.stringify(toEmails.map((email) => email.value))
    );
    formData.append("date", date);
    formData.append("time", time);
    formData.append("subject", subject);
    formData.append("text", newMailBody);

    await axios.post("/sendmail", formData, {
      "content-type": "multipart/form-data",
    });

    setModal({
      isShown: true,
      ModalTitle: "Email Sent",
      ModalBody: "Email has been sent successfully",
    });

    setToEmails([]);
    setSubject([]);
    setNewMailAttachments([]);
    setNewMailBody("");
  };

  const deleteSentMailHandler = async (mailid) => {
    await axios.post("deletesentmail", { mailid: mailid });
    setSentMails(sentMails.filter((mail) => mail._id !== mailid));
  };

  const deleteAllSentMailsHandler = async () => {
    await axios.post("deleteallsentmails", { email: user.email });
    setSentMails([]);
  };

  const deleteInboxMailHandler = async (mailid) => {
    await axios.post("deleteinboxmail", { mailid: mailid, email: user.email });
    setInboxMails(inboxMails.filter((mail) => mail._id !== mailid));
  };

  const deleteAllInboxMailsHandler = async () => {
    await axios.post("deleteallinboxmails", { email: user.email });
    setInboxMails([]);
  };

  return (
    <div className="Emails">
      <div className="Emails__expand_icon">
        <i
          class="fa fa-bars"
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        ></i>
      </div>
      <div className="Emails__icon_header" hidden={!showMenu}>
        <i
          class="fa fa-plus"
          title="New Mail"
          onClick={() => {
            setShowNewMail(true);
            setShowInbox(false);
            setShowSent(false);
            setShowMenu(false);
          }}
        ></i>
        <i
          class="fa fa-inbox"
          title="Inbox"
          onClick={async () => {
            const response = await axios.post("/fetchinboxmail", {
              email: user.email,
            });

            setInboxMails(response.data.emails);
            setShowNewMail(false);
            setShowInbox(true);
            setShowSent(false);
            setShowMenu(false);
          }}
        ></i>
        <i
          class="fa fa-paper-plane"
          title="Sent"
          onClick={async () => {
            const response = await axios.post("/fetchsentmail", {
              email: user.email,
            });

            setSentMails(response.data.emails);

            setShowNewMail(false);
            setShowInbox(false);
            setShowSent(true);
            setShowMenu(false);
          }}
        ></i>
        <i
          class="fa fa-users"
          title="Create Email-Group"
          onClick={() => {
            setCreateGroupModal({ isShown: true });
          }}
        ></i>
        <i
          class="fa fa-trash-o"
          title="Delete Email Group"
          onClick={async () => {
            const response = await axios.post("/getemailgroups", {
              owner: user.email,
            });
            const allgroups = response.data.allgroups.map((row) => ({
              name: row.name,
              owner: row.owner,
              recipients: row.receiveremails,
              label: row.name,
              value: row.name,
            }));
            setDeleteGroupModal({
              isShown: true,
              allgroups: allgroups,
            });
          }}
        ></i>
      </div>

      <div className="Emails__NewMail_container" hidden={!showNewMail}>
        <Select
          maxMenuHeight="35vh"
          className="customselect"
          styles={customStyles}
          isMulti={true}
          isSearchable={true}
          placeholder="To: "
          noOptionsMessage={() => "No Recipients."}
          onChange={(e) => {
            setToEmails(e);
          }}
          value={toEmails}
          options={allEmails}
        />
        <input
          type="text"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
          }}
          placeholder="Subject: "
          className="form-control"
        />
        <textarea
          className="form-control body"
          placeholder="Body: "
          value={newMailBody}
          onChange={(e) => {
            setNewMailBody(e.target.value);
          }}
        />
        <div className="Emails__NewMail_bottombar">
          <input
            type="file"
            className="form-control attachments"
            onChange={(e) => {
              if (typeof e.target.files[0] !== "undefined") {
                setNewMailAttachments([
                  ...newMailAttachments,
                  e.target.files[0],
                ]);
                setNewMailBody(
                  newMailBody + "\nAttachment: " + e.target.files[0].name + "\n"
                );
              }
            }}
          />
          <i
            class="fa fa-paperclip"
            title="Attachments"
            onClick={() => {
              $(".attachments").trigger("click");
            }}
          ></i>
          <i
            class="fa fa-trash"
            title="Delete Attachments"
            onClick={() => {
              $(".attachments").val(null);
              setNewMailAttachments([]);
              setNewMailBody(
                newMailBody
                  .split("\n")
                  .filter((line) => {
                    return line.indexOf("Attachment: ") == -1;
                  })
                  .filter((line) => {
                    return line !== "";
                  })
                  .join("\n")
              );
            }}
          ></i>
          <i
            class="fa fa-smile-o"
            title="Emojis"
            onClick={() => {
              setEmojiText("");
              setEmojiPickerModal({ isShown: true });
            }}
          ></i>
          <i
            class="fa fa-clock-o"
            title="Send Delay Email"
            onClick={() => {
              setTimerModal({ isShown: true });
            }}
          ></i>
          <i
            class="fa fa-arrow-right"
            onClick={sendMailHandler}
            title="Send Email"
          ></i>
        </div>
      </div>

      <div className="Emails__Inbox_container" hidden={!showInbox}>
        <button
          type="button"
          onClick={() => {
            deleteAllInboxMailsHandler();
          }}
          className="form-control customform"
        >
          Clear Inbox
        </button>
        <div>
          {inboxMails.length === 0 ? (
            <h1 className="Emails__emptymail">No Mails</h1>
          ) : (
            inboxMails.map((mail) => {
              return (
                <div className="Emails__SentMail_row">
                  <b>From:</b>
                  <h6>{mail.senderemail}</h6>
                  <b>Subject:</b>
                  <h6>{mail.subject}</h6>
                  <b>Body:</b>
                  <h6>{mail.text}</h6>
                  <b>Date and Time:</b>
                  <h6>{mail.date + " -- " + mail.time}</h6>
                  <i
                    class="fa fa-trash-o"
                    onClick={() => {
                      deleteInboxMailHandler(mail._id);
                    }}
                    title="Delete Mail"
                  ></i>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="Emails__SentMail_container" hidden={!showSent}>
        <button
          type="button"
          onClick={() => {
            deleteAllSentMailsHandler();
          }}
          className="form-control customform"
        >
          Clear Sent Mails
        </button>
        <div>
          {sentMails.length === 0 ? (
            <h1 className="Emails__emptymail">No Mails</h1>
          ) : (
            sentMails.map((mail) => {
              return (
                <div className="Emails__SentMail_row">
                  <b>To:</b>
                  {mail.receiveremails.map((receivermail) => (
                    <h6>{receivermail}</h6>
                  ))}
                  <b>Subject:</b>
                  <h6>{mail.subject}</h6>
                  <b>Body:</b>
                  <h6>{mail.text}</h6>
                  <b>Date and Time:</b>
                  <h6>{mail.date + " -- " + mail.time}</h6>
                  <i
                    class="fa fa-trash-o"
                    onClick={() => {
                      deleteSentMailHandler(mail._id);
                    }}
                    title="Delete Mail"
                  ></i>
                </div>
              );
            })
          )}
        </div>
      </div>
      <EmojiPickerModal
        isShown={emojiPickerModal.isShown}
        setIsShown={setEmojiPickerModal}
        message={newMailBody}
        setMessage={setNewMailBody}
        emojiText={emojiText}
        setEmojiText={setEmojiText}
      />
      <CreateGroupModal
        isShown={createGroupModal.isShown}
        setIsShown={setCreateGroupModal}
        email={user.email}
        allEmails={allEmails.filter((email) => {
          return email.isGroup !== true;
        })}
        setConnections={setConnections}
      />
      <DeleteGroupModal
        isShown={deleteGroupModal.isShown}
        setIsShown={setDeleteGroupModal}
        email={user.email}
        allgroups={deleteGroupModal.allgroups}
        setConnections={setConnections}
      />
      <TimerModal
        isShown={timerModal.isShown}
        setIsShown={setTimerModal}
        email={user.email}
        toEmails={toEmails}
        setToEmails={setToEmails}
        subject={subject}
        setSubject={setSubject}
        newMailBody={newMailBody}
        setNewMailBody={setNewMailBody}
        newMailAttachments={newMailAttachments}
        setNewMailAttachments={setNewMailAttachments}
      />
      <TemplateModal
        isShown={modal.isShown}
        setIsShown={setModal}
        ModalTitle={modal.ModalTitle}
        ModalBody={modal.ModalBody}
      />
    </div>
  );
};

export default Emails;
