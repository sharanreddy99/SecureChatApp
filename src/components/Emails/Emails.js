import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Emails.css";
import { useHistory, useLocation } from "react-router-dom";
import $ from "jquery";
import TemplateModal from "../Modals/TemplateModal";
import TimerModal from "./TimerModal";
import DateFormat from "dateformat";
import socketIOClient from "socket.io-client";

const Emails = () => {
  const location = useLocation();
  const history = useHistory();
  const user = location.state.user;

  //States
  const [connections, setConnections] = useState(location.state.connections);
  const [active, setActive] = useState(-1);
  const [connectionEmail, setConnectionEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [emailMessages, setEmailMessages] = useState(
    location.state.emailMessages
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
    subject: subject,
  });

  //Effects

  useEffect(() => {
    const socket = socketIOClient("http://localhost:4201");
    socket.on("users__removeconnection", (data) => {
      const newConnections = connections.filter((connection) => {
        return connection.email !== data.email;
      });

      setConnections(newConnections);
    });

    socket.on("emails__newemail", (data) => {
      if (
        (user.email == data.senderemail || user.email == data.receiveremail) &&
        (connectionEmail == data.senderemail ||
          connectionEmail == data.receiveremail)
      ) {
        setEmailMessages([...emailMessages, { ...data }]);
      }
    });

    socket.on("emails__delayedemails", (data) => {
      const newMessages = data.delayedEmails.filter((message) => {
        return (
          (user.email === message.senderemail ||
            user.email === message.receiveremail) &&
          (connectionEmail === message.senderemail ||
            connectionEmail === message.receiveremail)
        );
      });
      setEmailMessages([...emailMessages, ...newMessages]);
    });

    return () => {
      socket.disconnect();
      focusLastDiv();
    };
  });

  //Handlers
  const fetchEmails = async (email, connectionemail) => {
    const response = await axios.post("/fetchallemails", {
      email: email,
      connectionemail: connectionemail,
    });

    setEmailMessages(response.data.emailMessages);

    await axios.post("/emailsseen", {
      email: email,
      connectionemail: connectionemail,
    });
  };

  const sendEmailHandler = async () => {
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
        ModalTitle: "Type a Message Body...",
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
      subject: subject,
    };
    await axios.post("/sendemail", data);
    setMessage("");
    setSubject("");
  };

  const sendDelayEmailHandler = async () => {
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
      subject: subject,
    });
  };

  const focusLastDiv = () => {
    var objDiv = document.getElementsByClassName("Emails__chatarea")[0];
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  };

  return (
    <div className="Emails">
      <i
        class="fa fa-bars"
        onClick={() => {
          $(".Emails__sidebar").toggle(500);
        }}
      ></i>
      <div className="Emails__container">
        <div className="Emails__sidebar w-100 ">
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

                  fetchEmails(user.email, connection.email);
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
        <div className="Emails__chat w-100 ">
          <div className="Emails__chatarea">
            {console.log(emailMessages)}
            {emailMessages.map((message, ind) => {
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
                      Subject:
                      <br />
                      {message.subject}
                      <br />
                      <br />
                      Body:
                      <br />
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
          <div className="Emails__inputarea">
            <div className="row">
              <div className="col">
                <input
                  type="email"
                  name="email"
                  disabled={true}
                  value={connectionEmail}
                  onChange={(e) => {
                    setConnectionEmail(e.target.value);
                  }}
                  className="form-control customform"
                  placeholder="Enter Recipient Email"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col">
                <input
                  type="text"
                  className="form-control customform"
                  placeholder="Enter Subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col">
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  class="form-control customform"
                  placeholder="Enter message to be sent..."
                  rows="3"
                ></textarea>
                <i class="fa fa-paper-plane" onClick={sendEmailHandler}></i>
                <i class="fa fa-clock-o" onClick={sendDelayEmailHandler}></i>
              </div>
            </div>
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
        subject={timermodal.subject}
        setSubject={setSubject}
        email={timermodal.email}
        connectionemail={timermodal.connectionemail}
      />
    </div>
  );
};

export default Emails;
