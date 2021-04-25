import React, { useState } from "react";
import "./Connections.css";
import TemplateModal from "../Modals/TemplateModal";
import axios from "axios";
import { useStateValue } from "../../StateProvider";
import { useHistory, useLocation } from "react-router-dom";

const Connections = () => {
  const [{ user }, dispatch] = useStateValue();
  const location = useLocation();
  const history = useHistory();

  const [connectionemail, setConnectionEmail] = useState("");
  const [modal, setModal] = useState({
    isShown: false,
    ModalTitle: "",
    ModalBody: "",
  });

  const [unreadConnections, setUnreadConnections] = useState(
    location.state.unreadconnections
  );

  const addConnectionHandler = async () => {
    if (user.email == connectionemail) {
      setModal({
        isShown: true,
        ModalTitle: "LOL😂",
        ModalBody: "You can't send a connection request to yourself...",
      });
      setModalTimeoutHandler();
      return;
    }

    const response = await axios.post("/addconnection", {
      email: user.email,
      connectionemail: connectionemail,
    });
    setModal({
      isShown: true,
      ModalTitle: response.data.ModalTitle,
      ModalBody: response.data.ModalBody,
    });
    setModalTimeoutHandler();
  };

  const setModalTimeoutHandler = async () => {
    setTimeout(() => {
      setModal({ ...modal, isShown: false });
    }, 2000);
  };

  const removeConnectionHandler = async () => {
    if (user.email == connectionemail) {
      setModal({
        isShown: true,
        ModalTitle: "LOL😂",
        ModalBody: "You can't remove a connection to yourself...",
      });
      setModalTimeoutHandler();
      return;
    }
    const response = await axios.post("/removeconnection", {
      email: user.email,
      connectionemail: connectionemail,
    });
    setModal({
      isShown: true,
      ModalTitle: response.data.ModalTitle,
      ModalBody: response.data.ModalBody,
    });
    setModalTimeoutHandler();
  };

  const acceptConnectionHandler = async (connection) => {
    const response = await axios.post("/acceptconnection", {
      email: user.email,
      connectionemail: connection.email,
    });
    const newUnreadConnections = unreadConnections.filter((oldconnection) => {
      return oldconnection.email != connection.email;
    });

    history.replace({
      pathname: "/connections",
      state: { user, unreadconnections: newUnreadConnections },
    });

    setUnreadConnections(newUnreadConnections);
  };

  const rejectConnectionHandler = async (connection) => {
    const response = await axios.post("/removeconnection", {
      email: user.email,
      connectionemail: connection.email,
    });

    const newUnreadConnections = unreadConnections.filter((oldconnection) => {
      return oldconnection.email != connection.email;
    });

    history.replace({
      pathname: "/connections",
      state: { user, unreadconnections: newUnreadConnections },
    });

    setUnreadConnections(newUnreadConnections);
  };

  return (
    <div className="Connections">
      <div className="Connections__addconnections">
        <h1>Alter Connections</h1>
        <div className="Connections__addconnections_body">
          <div className="row">
            <div className="col">
              <h3>Enter Email ID</h3>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <input
                class="form-control"
                type="email"
                name="email"
                value={connectionemail}
                onChange={(e) => {
                  setConnectionEmail(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <button
                type="button"
                className="btn"
                name="addconnection"
                onClick={addConnectionHandler}
              >
                Send Connection Request
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <button
                type="button"
                className="btn"
                name="addconnection"
                onClick={removeConnectionHandler}
              >
                Remove Connection
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="Connections__incomingconnections">
        <h1>Connections Requests</h1>
        <div className="Connections__incomingconnections_body">
          {unreadConnections.map((unreadconnection, ind) => {
            return (
              <div className="Connections__unreadconnections" key={ind}>
                <div className="row">
                  <div className="col">
                    <img
                      src={unreadconnection.avatarUrl}
                      alt={unreadconnection.displayname}
                    />
                    <h5>{unreadconnection.email}</h5>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col">
                    <button
                      type="button"
                      className="btn w-100 btn-success"
                      name="accept"
                      onClick={() => {
                        acceptConnectionHandler(unreadconnection);
                      }}
                    >
                      Accept
                    </button>
                  </div>
                  <div className="col">
                    <button
                      type="button"
                      className="btn w-100 btn-danger"
                      name="reject"
                      onClick={() => {
                        rejectConnectionHandler(unreadconnection);
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <TemplateModal
        isShown={modal.isShown}
        setIsShown={setModal}
        ModalTitle={modal.ModalTitle}
        ModalBody={modal.ModalBody}
      />
    </div>
  );
};

export default Connections;
