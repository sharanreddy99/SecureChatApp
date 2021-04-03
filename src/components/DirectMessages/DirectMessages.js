import React, { useState, useEffect } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import "./DirectMessages.css";
import { useHistory, useLocation } from "react-router-dom";
import $ from "jquery";
import DateFormat from "dateformat";
import TemplateModal from "../Modals/TemplateModal";
import TimerModal from "./TimerModal";

const DirectMessages = () => {
  const location = useLocation();
  const history = useHistory();
  const user = location.state.user;

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

  //Effects

  useEffect(() => {
    if (active != -1) {
      $("#connection" + active).addClass("DirectMessages__connections_active");
    }
  }, []);

  useEffect(() => {
    const pusher = new Pusher("11a8dd35181269e15a84", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("users");

    channel.bind("removeconnection", (data) => {
      const newConnections = connections.filter((connection) => {
        return connection.email !== data.email;
      });

      history.replace({
        ...history.location,
        state: { ...location.state, connections: newConnections },
      });
      setConnections(newConnections);
    });
  }, [connections]);

  useEffect(() => {
    const pusher = new Pusher("11a8dd35181269e15a84", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("directmessages");

    channel.bind("newmessage", (data) => {
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

    channel.bind("delayedmessages", (data) => {
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
      channel.unbind_all();
      channel.unsubscribe();
      focusLastDiv();
    };
  }, [messages]);

  //Handlers
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
                    >
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
                if (e.keyCode == 13) {
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
    </div>
  );
};

export default DirectMessages;
