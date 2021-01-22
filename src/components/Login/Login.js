import React from "react";
import "./Login.css";
import ProfileImage from "../../assets/images/profile.png";
import { auth, provider } from "../../firebase";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";

const Login = () => {
  const [{}, dispatch] = useStateValue();
  const history = useHistory();

  const signInHandler = async () => {
    try {
      const result = await auth.signInWithPopup(provider);
      const userData = {
        displayname: result.user.displayName,
        email: result.user.email,
        avatarUrl: result.user.photoURL,
      };

      dispatch({
        type: actionTypes.SET_USER,
        user: userData,
      });

      await axios.post("/adduser", { ...userData });

      var response = await axios.post("/fetchconnections", {
        email: userData.email,
      });

      var response2 = await axios.post("/fetchunseendmscount", {
        email: userData.email,
      });

      var response3 = await axios.post("/fetchunseenemailscount", {
        email: userData.email,
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
          user: userData,
          connections: response.data.connections,
        },
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="Login">
      <div className="Login__container">
        <div className="Login__header">
          <img src={ProfileImage} alt="Image" />
          <br />
          <h4>SecureEncrypt Chat</h4>
        </div>
        <div className="Login__footer">
          <button class="Login__button" type="submit" onClick={signInHandler}>
            SIGN IN WITH GOOGLE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
