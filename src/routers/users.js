const express = require("express");
const router = new express.Router();

const Users = require("../models/users");
const DirectMessages = require("../models/directmessages");
const DelayDirectMessages = require("../models/delaydirectmessages");
const Emails = require("../models/emails");
const DelayEmails = require("../models/delayemails");

router.post("/adduser", async (req, res) => {
  try {
    const tempuser = await Users.findOne({ email: req.body.email });
    if (tempuser) {
      return res.status(201).send({ status: "Success" });
    }

    const data = {
      displayname: req.body.displayname,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
    };

    const user = new Users(data);
    await user.save();

    res.status(201).send({ status: "Success" });
  } catch (e) {
    console.log(e);
    res.status(201).send({ status: "Failure" });
  }
});

router.post("/acceptconnection", async (req, res) => {
  try {
    const email = req.body.email;
    const connectionemail = req.body.connectionemail;

    const user = await Users.findOne({ email: email });
    const connectionuser = await Users.findOne({ email: connectionemail });

    var changeuser = user;
    var changeconnectionuser = connectionuser;

    for (var i = 0; i < changeuser.connections.length; i++) {
      if (changeuser.connections[i].email == changeconnectionuser.email) {
        changeuser.connections[i].accepted = true;
        break;
      }
    }

    for (var i = 0; i < changeconnectionuser.connections.length; i++) {
      if (changeconnectionuser.connections[i].email == changeuser.email) {
        changeconnectionuser.connections[i].accepted = true;
        break;
      }
    }

    await changeuser.save();
    await changeconnectionuser.save();

    res.status(201).send({ status: "Success" });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: e });
  }
});

router.post("/addconnection", async (req, res) => {
  try {
    const email = req.body.email;
    const connectionemail = req.body.connectionemail;

    const user = await Users.findOne({ email: connectionemail });
    if (!user) {
      return res.status(201).send({
        ModalTitle: "Connection Not Registered...",
        ModalBody:
          "Connection is not registered with us...Check the Email-ID entered...",
      });
    }

    const currentuser = await Users.findOne({ email: email });

    var isConnectionPresent = false;
    var i = 0;
    for (; i < currentuser.connections.length; i++) {
      if (currentuser.connections[i].email == connectionemail) {
        isConnectionPresent = true;
        if (currentuser.connections[i].accepted == false) {
          return res.status(201).send({
            ModalTitle: "Duplicate Connection Request...",
            ModalBody: "Please wait for the user to respond to the request...",
          });
        }
        break;
      }
    }

    if (isConnectionPresent) {
      return res.status(201).send({
        ModalTitle: "Connection Already Exists...",
        ModalBody: "The User is already connected with you...",
      });
    } else {
      var updateconnectionuser = user;
      var updatecurrentuser = currentuser;
      updateconnectionuser.connections.push({
        email: updatecurrentuser.email,
        displayname: updatecurrentuser.displayname,
        avatarUrl: updatecurrentuser.avatarUrl,
        isSender: false,
      });

      updatecurrentuser.connections.push({
        email: updateconnectionuser.email,
        displayname: updateconnectionuser.displayname,
        avatarUrl: updateconnectionuser.avatarUrl,
        isSender: true,
      });

      await updateconnectionuser.save();
      await updatecurrentuser.save();

      res.status(201).send({
        ModalTitle: "Connection Request Sent...",
        ModalBody: "A Request has been sent to the connection successfully...",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(201).send({
      ModalTitle: "Internal Server Error...",
      ModalBody:
        "Error occured at server.. Please try again after some time...",
    });
  }
});

router.post("/newconnections", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await Users.findOne({ email: email }, { connections: 1 });

    var unreadconnections = user.connections.filter((connection) => {
      return connection.accepted === false && connection.isSender === false;
    });

    res.status(201).send({ unreadconnections });
  } catch (e) {
    res.status(201).send({
      ModalTitle: "Internal Server Error...",
      ModalBody:
        "Error occured at server.. Please try again after some time...",
    });
  }
});

router.post("/removeconnection", async (req, res) => {
  try {
    const email = req.body.email;
    const connectionemail = req.body.connectionemail;

    const user = await Users.findOne({ email: email });
    var changeuser = user;

    changeuser.connections = changeuser.connections.filter((connection) => {
      return connection.email != connectionemail;
    });

    const connectionuser = await Users.findOne({ email: connectionemail });
    if (!connectionuser) {
      return res.status(201).send({
        ModalTitle: "Connection Not Registered...",
        ModalBody:
          "Connection is not registered with us...Check the Email-ID entered...",
      });
    }

    var changeconnectionuser = connectionuser;
    changeconnectionuser.connections = changeconnectionuser.connections.filter(
      (connection) => {
        return connection.email != email;
      }
    );

    await DirectMessages.deleteMany({
      $or: [
        {
          senderemail: changeuser.email,
          receiveremail: changeconnectionuser.email,
        },
        {
          senderemail: changeconnectionuser.email,
          receiveremail: changeuser.email,
        },
      ],
    });

    await DelayDirectMessages.deleteMany({
      $or: [
        {
          senderemail: changeuser.email,
          receiveremail: changeconnectionuser.email,
        },
        {
          senderemail: changeconnectionuser.email,
          receiveremail: changeuser.email,
        },
      ],
    });

    await Emails.deleteMany({
      $or: [
        {
          senderemail: changeuser.email,
          receiveremail: changeconnectionuser.email,
        },
        {
          senderemail: changeconnectionuser.email,
          receiveremail: changeuser.email,
        },
      ],
    });

    await DelayEmails.deleteMany({
      $or: [
        {
          senderemail: changeuser.email,
          receiveremail: changeconnectionuser.email,
        },
        {
          senderemail: changeconnectionuser.email,
          receiveremail: changeuser.email,
        },
      ],
    });

    req.app.get("socketio").emit("users__removeconnection", { email: email });

    await changeconnectionuser.save();
    await changeuser.save();

    res.status(201).send({
      ModalTitle: "Connection And Data Removed..",
      ModalBody:
        "The connection as well as the associated data has been removed successfully...",
    });
  } catch (e) {
    res.status(201).send({
      ModalTitle: "Internal Server Error...",
      ModalBody:
        "Error occured at server.. Please try again after some time...",
    });
  }
});

router.post("/fetchconnections", async (req, res) => {
  try {
    const email = req.body.email;

    const tempuser = await Users.findOne(
      {
        email: req.body.email,
      },
      { connections: 1 }
    );

    const user = tempuser.connections.filter((connection) => {
      return connection.accepted === true;
    });

    if (user) {
      return res.status(201).send({ connections: user });
    } else {
      res.status(201).send({ connections: [] });
    }
  } catch (e) {
    console.log(e);
    res.status(401).send({ status: "failure" });
  }
});

module.exports = router;
