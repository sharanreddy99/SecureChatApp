import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DirectMessages.css";
import { useHistory, useLocation } from "react-router-dom";
import $ from "jquery";
import DateFormat from "dateformat";
import TemplateModal from "../Modals/TemplateModal";
import TimerModal from "./TimerModal";
import DeleteMessageModal from "./DeleteMessageModal";
import UpdateMessageModal from "./UpdateMessageModal";
import { io } from "socket.io-client";
import EmojiPickerModal from "../Modals/EmojiPickerModal";

const DirectMessages = () => {
  const location = useLocation();
  const history = useHistory();
  const user = location.state.user;
  var editbutton = undefined;
  var deletebutton = undefined;

  //States
  const [connections, setConnections] = useState(location.state.connections);
  const [active, setActive] = useState(
    location.state.active !== undefined ? location.state.active : -1
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(location.state.allMessages);
  const [connectionEmail, setConnectionEmail] = useState(
    location.state.connectionemail ? location.state.connectionemail : ""
  );
  const [emojiText, setEmojiText] = useState("");
  const [modal, setModal] = useState({
    isShown: false,
    ModalTitle: "",
    ModalBody: "",
  });
  const [timermodal, setTimerModal] = useState({
    isShown: false,
    message: message,
    email: user.email,
    connectionemail: connectionEmail,
  });
  const [deleteMessageModal, setDeleteMessageModal] = useState({
    isShown: false,
    message: "",
  });
  const [updateMessageModal, setUpdateMessageModal] = useState({
    isShown: false,
    message: "",
  });
  const [emojiPickerModal, setEmojiPickerModal] = useState({
    isShown: false,
  });

  //Effects
  useEffect(() => {
    if (active != -1) {
      $("#connection" + active).addClass("DirectMessages__connections_active");
      focusLastDiv();
    }
  }, []);

  useEffect(() => {
    const socket = io({ path: "/web_socket_server" });

    socket.on("users__removeconnection", (data) => {
      const newConnections = connections.filter((connection) => {
        return connection.email !== data.email;
      });

      history.replace({
        ...history.location,
        state: { ...location.state, connections: newConnections },
      });
      setConnections(newConnections);
    });

    socket.on("directmessages__deletemessage", (data) => {
      const newMessages = messages.filter((row) => row._id !== data._id);
      history.replace({
        ...history.location,
        state: { ...location.state, allMessages: newMessages },
      });
      setMessages(newMessages);
    });

    socket.on("directmessages__updatemessage", (data) => {
      const newMessages = messages.map((row) => {
        if (row._id === data._id) {
          return data;
        }
        return row;
      });
      history.replace({
        ...history.location,
        state: { ...location.state, allMessages: newMessages },
      });
      setMessages(newMessages);
    });

    socket.on("directmessages__newmessage", (data) => {
      if (
        (user.email == data.senderemail || user.email == data.receiveremail) &&
        (connectionEmail == data.senderemail ||
          connectionEmail == data.receiveremail)
      ) {
        history.replace({
          ...history.location,
          state: { ...location.state, allMessages: [...messages, { ...data }] },
        });
        setMessages([...messages, { ...data }]);
      }
    });

    socket.on("directmessages__delayedmessages", (data) => {
      const newMessages = data.delayedMessages.filter((message) => {
        return (
          (user.email === message.senderemail ||
            user.email === message.receiveremail) &&
          (connectionEmail === message.senderemail ||
            connectionEmail === message.receiveremail)
        );
      });
      history.replace({
        ...history.location,
        state: { ...location.state, allMessages: [...messages, { ...data }] },
      });
      setMessages([...messages, ...newMessages]);
    });

    return () => {
      socket.disconnect();
      focusLastDiv();
    };
  });

  //Handlers

  const addHoverClass = () => {
    if (typeof editbutton === "object" && typeof deletebutton === "object") {
      editbutton.classList.add("DirectMessages__message_hover");
      editbutton.classList.remove("DirectMessages__message_non_hover");
      deletebutton.classList.add("DirectMessages__message_hover");
      deletebutton.classList.remove("DirectMessages__message_non_hover");
    }
  };

  const removeHoverClass = () => {
    if (typeof editbutton === "object" && typeof deletebutton === "object") {
      editbutton.classList.remove("DirectMessages__message_hover");
      editbutton.classList.add("DirectMessages__message_non_hover");
      deletebutton.classList.remove("DirectMessages__message_hover");
      deletebutton.classList.add("DirectMessages__message_non_hover");
    }
  };

  const fetchChat = async (email, connectionemail) => {
    const response = await axios.post("/fetchalldirectmessages", {
      email: email,
      connectionemail: connectionemail,
    });

    setMessages(response.data.allMessages);

    await axios.post("/directmessagesseen", {
      email: email,
      connectionemail: connectionemail,
    });
  };

  const sendMessageHandler = async () => {
    if (connectionEmail == "") {
      setModal({
        isShown: true,
        ModalTitle: "Choose a Recepient...",
        ModalBody: "Please Choose a User to chat with...",
      });
      return;
    }

    if (message === "") {
      setModal({
        isShown: true,
        ModalTitle: "Type a Message...",
        ModalBody: "Please type something to send...",
      });
      return;
    }

    const date = DateFormat(new Date(), "yyyy-mm-dd");
    const time = DateFormat(new Date(), "HH:MM");

    const data = {
      text: message,
      email: user.email,
      connectionemail: connectionEmail,
      date: date,
      time: time,
    };
    await axios.post("/senddirectmessage", data);
    setMessage("");
  };

  const focusLastDiv = () => {
    var objDiv = document.getElementsByClassName("DirectMessages__chatarea")[0];
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  };

  return (
    <div className="DirectMessages">
      <i
        class="fa fa-bars"
        onClick={() => {
          $(".DirectMessages__sidebar").toggle(500);
        }}
      ></i>
      <div className="DirectMessages__container">
        <div className="DirectMessages__sidebar w-100 ">
          {connections.map((connection, ind) => {
            return (
              <div
                id={"connection" + ind}
                className={`DirectMessages__connections `}
                onClick={() => {
                  if (active != -1) {
                    $("#connection" + active).removeClass(
                      "DirectMessages__connections_active"
                    );
                  }
                  setActive(ind);
                  $("#connection" + ind).addClass(
                    "DirectMessages__connections_active"
                  );

                  setConnectionEmail(connection.email);

                  fetchChat(user.email, connection.email);
                }}
                key={ind}
              >
                <div className="row">
                  <div className="col">
                    <img
                      src={connection.avatarUrl}
                      alt={connection.displayname}
                    />
                    <h5>{connection.email}</h5>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="DirectMessages__chat w-100 ">
          <div className="DirectMessages__chatarea">
            {messages.map((message, ind) => {
              return (
                <div className="row" key={ind}>
                  <div className="col">
                    <p
                      className={`DirectMessages__message ${
                        message.senderemail == user.email
                          ? "sender"
                          : "receiver"
                      }`}
                      onMouseEnter={(e) => {
                        editbutton = e.target.children[0];
                        deletebutton = e.target.children[1];
                        addHoverClass();
                      }}
                      onMouseLeave={() => {
                        removeHoverClass();
                      }}
                    >
                      <i
                        class="fa fa-pencil-square-o DirectMessages__edit_button DirectMessages__message_non_hover"
                        onClick={() => {
                          setUpdateMessageModal({
                            isShown: true,
                            message: message,
                            editbutton: editbutton,
                            deletebutton: deletebutton,
                          });
                        }}
                      ></i>
                      <i
                        class="fa fa-trash DirectMessages__delete_button DirectMessages__message_non_hover"
                        onClick={() => {
                          setDeleteMessageModal({
                            isShown: true,
                            message: message,
                            editbutton: editbutton,
                            deletebutton: deletebutton,
                          });
                        }}
                      ></i>

                      {message.text}
                    </p>
                    {message.senderemail == user.email ? (
                      <>
                        <p
                          className={`DirectMessages__time ${
                            message.senderemail == user.email
                              ? "sender"
                              : "receiver"
                          }`}
                        >
                          {message.time}
                        </p>
                        <p
                          className={`DirectMessages__date ${
                            message.senderemail == user.email
                              ? "sender"
                              : "receiver"
                          }`}
                        >
                          {message.date} &nbsp;&nbsp;
                        </p>
                      </>
                    ) : (
                      <>
                        <p
                          className={`DirectMessages__date ${
                            message.senderemail == user.email
                              ? "sender"
                              : "receiver"
                          }`}
                        >
                          {message.date} &nbsp;&nbsp;
                        </p>
                        <p
                          className={`DirectMessages__time ${
                            message.senderemail == user.email
                              ? "sender"
                              : "receiver"
                          }`}
                        >
                          {message.time}
                        </p>{" "}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="DirectMessages__inputarea">
            <input
              class="form-control customform"
              type="text"
              name="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessageHandler();
                }
              }}
            />
            <i class="fa fa-paper-plane" onClick={sendMessageHandler}></i>
            <i
              class="fa fa-clock-o"
              onClick={() => {
                if (connectionEmail == "") {
                  setModal({
                    isShown: true,
                    ModalTitle: "Choose a Recepient...",
                    ModalBody: "Please Choose a User to chat with...",
                  });
                  return;
                }

                if (message === "") {
                  setModal({
                    isShown: true,
                    ModalTitle: "Type a Message...",
                    ModalBody: "Please type something to send...",
                  });
                  return;
                }

                setTimerModal({
                  isShown: true,
                  message: message,
                  email: user.email,
                  connectionemail: connectionEmail,
                });
              }}
            ></i>
            <i
              class="fa fa-smile-o"
              onClick={() => {
                setEmojiText("");
                setEmojiPickerModal({ isShown: true });
              }}
            ></i>
          </div>
        </div>
      </div>
      <TemplateModal
        isShown={modal.isShown}
        setIsShown={setModal}
        ModalTitle={modal.ModalTitle}
        ModalBody={modal.ModalBody}
      />
      <TimerModal
        isShown={timermodal.isShown}
        setIsShown={setTimerModal}
        message={timermodal.message}
        setMessage={setMessage}
        email={timermodal.email}
        connectionemail={timermodal.connectionemail}
      />
      <UpdateMessageModal
        isShown={updateMessageModal.isShown}
        setIsShown={setUpdateMessageModal}
        message={updateMessageModal.message}
        editbutton={updateMessageModal.editbutton}
        deletebutton={updateMessageModal.deletebutton}
        connectionemail={connectionEmail}
      />
      <DeleteMessageModal
        isShown={deleteMessageModal.isShown}
        setIsShown={setDeleteMessageModal}
        message={deleteMessageModal.message}
        messages={messages}
        setMessages={setMessages}
        editbutton={deleteMessageModal.editbutton}
        deletebutton={deleteMessageModal.deletebutton}
      />
      <EmojiPickerModal
        isShown={emojiPickerModal.isShown}
        setIsShown={setEmojiPickerModal}
        message={message}
        setMessage={setMessage}
        emojiText={emojiText}
        setEmojiText={setEmojiText}
      />
    </div>
  );
};

export default DirectMessages;
