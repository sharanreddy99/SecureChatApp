const express = require("express");
const DateFormat = require("dateformat");
const router = new express.Router();

const DirectMessages = require("../models/directmessages");
const DelayDirectMessages = require("../models/delaydirectmessages");

var Filter = require("bad-words");
var filter = new Filter();
const encryptor = require("simple-encryptor")(process.env.SECURECHAT_NODE_SECRET_KEY);

router.post("/deletedirectmessage", async (req, res) => {
  try {
    await DirectMessages.deleteOne({ _id: req.body.message._id });

    req.app
      .get("socketio")
      .emit("directmessages__deletemessage", { _id: req.body.message._id });

    res.status(201).send({ msg: "success" });
  } catch (e) {
    res.status(401).send({ error: "error" });
  }
});

router.post("/updatedirectmessage", async (req, res) => {
  try {
    const response = await DirectMessages.updateOne(
      { _id: req.body.message._id, receiveremail: req.body.connectionemail },
      { text: encryptor.encrypt(filter.clean(req.body.newmessage)) }
    );

    if (response.nModified === 1) {
      const newMessage = { ...req.body.message, text: req.body.newmessage };
      req.app.get("socketio").emit("directmessages__updatemessage", newMessage);
    }

    res.status(201).send({ msg: "success" });
  } catch (e) {
    res.status(401).send({ error: "error" });
  }
});

router.post("/senddirectmessage", async (req, res) => {
  try {
    var rawtext = null;
    try {
      rawtext = encryptor.encrypt(filter.clean(req.body.text));
    } catch (e) {
      rawtext = encryptor.encrypt(req.body.text);
    }
    var data = {
      text: rawtext,
      senderemail: req.body.email,
      receiveremail: req.body.connectionemail,
      date: req.body.date,
      time: req.body.time,
    };

    const message = new DirectMessages(data);
    await message.save();

    data.date = DateFormat(data.date, "mmm dS, yyyy");
    data.text = encryptor.decrypt(data.text);
    data._id  = message._id

    req.app.get("socketio").emit("directmessages__newmessage", { ...data });

    res.status(201).send({ msg: "success" });
  } catch (e) {
    res.status(401).send({ error: "error" });
  }
});

router.post("/fetchalldirectmessages", async (req, res) => {
  try {
    const allMessages = await DirectMessages.find(
      {
        $or: [
          {
            $and: [
              { senderemail: req.body.email },
              { receiveremail: req.body.connectionemail },
            ],
          },
          {
            $and: [
              { senderemail: req.body.connectionemail },
              { receiveremail: req.body.email },
            ],
          },
        ],
      },
      null,
      {
        sort: { _id: 1 },
      }
    );

    var changeAllMessages = allMessages.map((message) => {
      message.text = encryptor.decrypt(message.text);
      message.date = DateFormat(message.date, "mmm dS, yyyy");
      return message;
    });

    res.status(201).send({ allMessages: changeAllMessages });
  } catch (e) {
    console.log(e);
    res.status(401).send({ status: "failure" });
  }
});

router.post("/fetchunseendmscount", async (req, res) => {
  try {
    const allMessages = await DirectMessages.find(
      {
        receiveremail: req.body.email,
        seen: false,
      },
      {
        senderemail: 1,
      }
    );

    var unseencount = {};
    for (let i = 0; i < allMessages.length; i++) {
      unseencount[allMessages[i].senderemail] = 0;
    }

    for (let i = 0; i < allMessages.length; i++) {
      unseencount[allMessages[i].senderemail] += 1;
    }

    res.status(201).send({ unseencount: unseencount });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

router.post("/directmessagesseen", async (req, res) => {
  try {
    const allMessages = await DirectMessages.find({
      receiveremail: req.body.email,
      senderemail: req.body.connectionemail,
      seen: false,
    });

    var seeAllMessages = allMessages.map(async (message) => {
      message.seen = true;
      await message.save();
      return message;
    });

    res.status(201).send({ status: "success" });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

router.post("/delaydirectmessage", async (req, res) => {
  try {
    var rawtext = null;
    try {
      rawtext = encryptor.encrypt(filter.clean(req.body.text));
    } catch (e) {
      rawtext = encryptor.encrypt(req.body.text);
    }

    var data = {
      text: rawtext,
      senderemail: req.body.senderemail,
      receiveremail: req.body.receiveremail,
      date: req.body.date,
      time: req.body.time,
    };

    if (DateFormat(data.date + " " + data.time) <= DateFormat()) {
      return res.status(200).send({
        status: "failure",
        ModalTitle: "Past Date and Time Chosen...",
        ModalBody: "Please choose a valid date and time in the future...",
      });
    }

    const delayDirectMessage = new DelayDirectMessages(data);
    await delayDirectMessage.save();

    res.status(201).send({
      status: "success",
      ModalTitle: "Message Sent...",
      ModalBody:
        "Message will be sent at " +
        DateFormat(data.date + " " + data.time, "mmm dS, yyyy hh:MM TT"),
    });
  } catch (e) {
    res.status(200).send({
      status: "failure",
      ModalTitle: "Server Error...",
      ModalBody: "Internal Server Error Occured...",
    });
  }
});

module.exports = router;
