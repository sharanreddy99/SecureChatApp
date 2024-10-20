import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useStateValue } from "../../StateProvider";
import { useHistory, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const location = useLocation();

  //States
  const [DMSConnections, setDMSConnections] = useState(
    location.state.connections
  );
  const [EmailConnections, setEmailConnections] = useState(
    location.state.emailconnections
  );
  const [groupChats, setGroupChats] = useState(location.state.groups);

  //Effects
  useEffect(() => {
    const socket = io({ path: "/web_socket_server" });

    socket.on("users__removeconnection", (data) => {
      const newConnections = DMSConnections.filter((connection) => {
        return connection.email !== data.email;
      });
      const newEmailConnections = EmailConnections.filter((connection) => {
        return connection.email !== data.email;
      });
      history.replace({
        ...history.location,
        state: {
          ...location.state,
          connections: newConnections,
          emailconnections: newEmailConnections,
        },
      });
      setDMSConnections(newConnections);
      setEmailConnections(newEmailConnections);
    });

    return () => {
      socket.disconnect();
    };
  });

  //Handlers
  const goToDirectMessages = async () => {
    history.push({
      pathname: "/directmessages",
      state: {
        user: user,
        connections: location.state.connections,
        allMessages: [],
      },
    });
  };

  const goToGroupMessages = async () => {
    history.push({
      pathname: "/groupmessages",
      state: {
        user: user,
        connections: location.state.connections,
        groups: location.state.groups,
        allMessages: [],
      },
    });
  };

  const goToEmails = async () => {
    const response = await axios.post("/getemailgroups", { owner: user.email });
    const allgroups = response.data.allgroups.map((group) => ({
      email: group.name,
      isGroup: true,
    }));

    const response2 = await axios.post("/fetchinboxmail", {
      email: user.email,
    });

    history.push({
      pathname: "/emails",
      state: {
        user: user,
        connections: [...location.state.emailconnections, ...allgroups],
        inboxMails: response2.data.emails,
      },
    });
  };

  const fetchChat = async (email, connectionemail) => {
    const response = await axios.post("/fetchalldirectmessages", {
      email: email,
      connectionemail: connectionemail,
    });

    await axios.post("/directmessagesseen", {
      email: email,
      connectionemail: connectionemail,
    });

    var active = location.state.connections.findIndex((connection) => {
      return connection.email === connectionemail;
    });

    var connectionemail = "";
    if (active != -1) {
      connectionemail = location.state.connections[active].email;
    }

    history.push({
      pathname: "/directmessages",
      state: {
        user: user,
        connections: location.state.connections,
        connectionemail: connectionemail,
        allMessages: response.data.allMessages,
        active: active,
      },
    });
  };

  const fetchGroupChat = async (group) => {
    const response = await axios.post("/fetchallgroupmessages", {
      groupid: group._id,
      groupname: group.name,
      email: user.email,
    });

    await axios.post("/groupmessagesseen", {
      groupid: group._id,
      groupname: group.name,
      email: user.email,
    });

    var active = location.state.groups.findIndex(
      (row) => row._id === group._id && row.name === group.name
    );
    var activeGroup = {};
    if (active != -1) {
      activeGroup = location.state.groups[active];
    }

    history.push({
      pathname: "/groupmessages",
      state: {
        user: user,
        connections: location.state.connections,
        groups: location.state.groups,
        active: active,
        activeGroup: activeGroup,
        allMessages: response.data.allMessages,
      },
    });
  };

  const fetchEmail = async (email, connectionemail) => {
    const response = await axios.post("/fetchspecificinboxmail", {
      email: email,
      connectionemail: connectionemail,
    });

    await axios.post("/emailsseen", {
      email: email,
      connectionemail: connectionemail,
    });

    const response2 = await axios.post("/getemailgroups", {
      owner: user.email,
    });
    const allgroups = response2.data.allgroups.map((group) => ({
      email: group.name,
      isGroup: true,
    }));

    history.push({
      pathname: "/emails",
      state: {
        user: user,
        connections: [...location.state.emailconnections, ...allgroups],
        inboxMails: response.data.emails,
      },
    });
  };

  return (
    <div className="Dashboard__container">
      <div className="Dashboard__directmessages Dashboard__row">
        <div className="row Dashboard__row_header">
          <div className="col-10 text-center">
            <h3>Direct Messages</h3>
          </div>
          <div className="col Dashboard__row_icon">
            <i
              onClick={goToDirectMessages}
              className="fa fa-external-link-square"
            ></i>
          </div>
        </div>
        {DMSConnections.length > 0 ? (
          DMSConnections.map((connection, ind) => {
            return (
              <div
                className="Dashboard__DM_container"
                onClick={() => {
                  fetchChat(user.email, connection.email);
                }}
                key={ind}
              >
                <div className="row p-0 mt-2 m-0">
                  <div className="col-2">
                    <img
                      src={connection.avatarUrl}
                      alt={connection.displayname}
                    />
                  </div>
                  <div className="col-8">
                    <h5>{connection.email}</h5>
                  </div>
                  <div className="col-2">
                    <p style={{ float: "right" }}>{connection.unseen}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="div"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <h4
              style={{
                textShadow: "1px 1px var(--logoTextColor)",
                fontWeight: "bold",
              }}
            >
              No Connections...
            </h4>
          </div>
        )}
      </div>

      <div className="Dashboard__directmessages Dashboard__row">
        <div className="row Dashboard__row_header">
          <div className="col-10 text-center">
            <h3>Group Messages</h3>
          </div>
          <div className="col Dashboard__row_icon">
            <i
              onClick={goToGroupMessages}
              className="fa fa-external-link-square"
            ></i>
          </div>
        </div>
        {groupChats.length > 0 ? (
          groupChats.map((group, ind) => {
            return (
              <div
                className="Dashboard__DM_container"
                onClick={() => {
                  fetchGroupChat(group);
                }}
                key={ind}
              >
                <div className="row p-0 mt-2 m-0">
                  <div className="col-2">
                    <img src={group.pictureUrl} alt="." />
                  </div>
                  <div className="col-8">
                    <h5>{group.name}</h5>
                  </div>
                  <div className="col-2">
                    <p style={{ float: "right" }}>{group.unseen}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="div"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <h4
              style={{
                textShadow: "1px 1px var(--logoTextColor)",
                fontWeight: "bold",
              }}
            >
              No Groups Available...
            </h4>
          </div>
        )}
      </div>

      <div className="Dashboard__directmessages Dashboard__row">
        <div className="row Dashboard__row_header">
          <div className="col-10 text-center">
            <h3>Emails </h3>
          </div>
          <div className="col Dashboard__row_icon">
            <i onClick={goToEmails} className="fa fa-external-link-square"></i>
          </div>
        </div>
        {EmailConnections.length > 0 ? (
          EmailConnections.map((connection, ind) => {
            return (
              <div
                className="Dashboard__DM_container"
                onClick={() => {
                  fetchEmail(user.email, connection.email);
                }}
                key={ind}
              >
                <div className="row p-0 mt-2 m-0">
                  <div className="col-2">
                    <img
                      src={connection.avatarUrl}
                      alt={connection.displayname}
                    />
                  </div>
                  <div className="col-8">
                    <h5>{connection.email}</h5>
                  </div>
                  <div className="col-2">
                    <p style={{ float: "right" }}>{connection.unseenemail}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="div"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <h4
              style={{
                textShadow: "1px 1px var(--logoTextColor)",
                fontWeight: "bold",
              }}
            >
              No Connections...
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
