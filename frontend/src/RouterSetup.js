import React from "react";

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import Login from "./components/Login/Login";
import PageTemplate from "./components/PageTemplate/PageTemplate";
import Dashboard from "./components/Dashboard/Dashboard";
import Connections from "./components/Connections/Connections";
import DirectMessages from "./components/DirectMessages/DirectMessages";
import GroupMessages from "./components/GroupMessages/GroupMessages";
import Emails from "./components/Emails/Emails";
import AboutUs from "./components/AboutUs/AboutUs";

const RouterSetup = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/aboutus">
            <PageTemplate>
              <AboutUs />
            </PageTemplate>
          </Route>
          <Route exact path="/dashboard">
            <PageTemplate>
              <Dashboard />
            </PageTemplate>
          </Route>
          <Route exact path="/connections">
            <PageTemplate>
              <Connections />
            </PageTemplate>
          </Route>
          <Route exact path="/directmessages">
            <PageTemplate>
              <DirectMessages />
            </PageTemplate>
          </Route>
          <Route exact path="/groupmessages">
            <PageTemplate>
              <GroupMessages />
            </PageTemplate>
          </Route>
          <Route exact path="/emails">
            <PageTemplate>
              <Emails />
            </PageTemplate>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default RouterSetup;
