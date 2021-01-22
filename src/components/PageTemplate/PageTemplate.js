import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import "./PageTemplate.css";
import axios from "axios";

const PageTemplate = (props) => {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.user) {
      dispatch({
        type: actionTypes.SET_USER,
        user: location.state.user,
      });
    } else {
      dispatch({
        type: actionTypes.REMOVE_USER,
      });
      history.push("/login");
    }
  }, []);

  const addConnectionHandler = async () => {
    const response = await axios.post("/newconnections", { email: user.email });
    history.push({
      pathname: "/connections",
      state: {
        ...location.state,
        unreadconnections: response.data.unreadconnections,
      },
    });
  };

  const dashBoardLogoHandler = async () => {
    var email = location.state.user.email;

    var response = await axios.post("/fetchconnections", {
      email: email,
    });

    var response2 = await axios.post("/fetchunseendmscount", {
      email: email,
    });

    var response3 = await axios.post("/fetchunseenemailscount", {
      email: email,
    });

    var connections = response.data.connections;
    for (let i = 0; i < connections.length; i++) {
      if (response2.data.unseencount[connections[i].email] == undefined)
        connections[i].unseen = 0;
      else
        connections[i].unseen =
          response2.data.unseencount[connections[i].email];
    }

    for (let i = 0; i < connections.length; i++) {
      if (response3.data.unseencount[connections[i].email] == undefined)
        connections[i].unseenemail = 0;
      else
        connections[i].unseenemail =
          response3.data.unseencount[connections[i].email];
    }

    connections.sort((a, b) => (a.unseen < b.unseen ? 1 : -1));
    connections.sort((a, b) => (a.unseenemail < b.unseenemail ? 1 : -1));

    history.push({
      pathname: "/dashboard",
      state: {
        user: location.state.user,
        connections: connections,
        allMessages: [],
        emailMessages: [],
      },
    });
  };

  const settingsHandler = () => {};

  const logoutHandler = () => {
    dispatch({
      type: actionTypes.REMOVE_USER,
    });
    localStorage.removeItem("user");

    history.push("/login");
  };

  return (
    <div className="PageTemplate__container">
      <div className="PageTemplate__navbar">
        <nav className="navbar">
          <div className="container-fluid">
            <a className="navbar-brand" onClick={dashBoardLogoHandler}>
              SecureEncryptChat
            </a>
            <div className="PageTemplate__navbar_icons">
              <i onClick={addConnectionHandler} className="fa fa-users"></i>
              <i onClick={settingsHandler} className="fa fa-cog"></i>
              <i onClick={logoutHandler} className="fa fa-sign-out"></i>
            </div>
          </div>
        </nav>
      </div>
      <div className="PageTemplate__body">{props.children}</div>
      <div className="PageTemplate__footer">
        <b>
          ⓒ 2020 - {new Date().getFullYear()} SECURE ENCRYPT CHAT, Inc. All
          rights reserved.
        </b>
      </div>
    </div>
  );
};

export default PageTemplate;
