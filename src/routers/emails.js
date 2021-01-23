const express = require("express");
const DateFormat = require("dateformat");
const router = new express.Router();

const pusher = require("../db/pusher");
const Emails = require("../models/emails");
const DelayEmails = require("../models/delayemails");

router.post("/sendemail", async (req, res) => {
  try {
    var data = {
      text: req.body.text,
      senderemail: req.body.email,
      receiveremail: req.body.connectionemail,
      subject: req.body.subject,
      date: req.body.date,
      time: req.body.time,
    };

    const email = new Emails(data);
    await email.save();

    data.date = DateFormat(data.date, "mmm dS, yyyy");

    await pusher.trigger("emails", "newemail", {
      ...data,
    });

    res.status(201).send({ msg: "success" });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

router.post("/fetchallemails", async (req, res) => {
  try {
    const allEmails = await Emails.find(
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
        sort: { date: 1, time: 1 },
      }
    );

    var changeAllEmails = allEmails.map((email) => {
      email.date = DateFormat(email.date, "mmm dS, yyyy");
      return email;
    });

    res.status(201).send({ emailMessages: changeAllEmails });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

router.post("/fetchunseenemailscount", async (req, res) => {
  try {
    const allEmails = await Emails.find(
      {
        receiveremail: req.body.email,
        seen: false,
      },
      {
        senderemail: 1,
      }
    );

    var unseencount = {};
    for (let i = 0; i < allEmails.length; i++) {
      unseencount[allEmails[i].senderemail] = 0;
    }

    for (let i = 0; i < allEmails.length; i++) {
      unseencount[allEmails[i].senderemail] += 1;
    }

    res.status(201).send({ unseencount: unseencount });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

router.post("/emailsseen", async (req, res) => {
  try {
    const allEmails = await Emails.find({
      receiveremail: req.body.email,
      senderemail: req.body.connectionemail,
      seen: false,
    });

    var seeAllEmails = allEmails.map(async (email) => {
      email.seen = true;
      await email.save();
      return email;
    });

    res.status(201).send({ status: "success" });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

router.post("/delayemail", async (req, res) => {
  try {
    var data = {
      text: req.body.text,
      senderemail: req.body.senderemail,
      receiveremail: req.body.receiveremail,
      subject: req.body.subject,
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

    const delayEmail = new DelayEmails(data);
    await delayEmail.save();

    res.status(201).send({
      status: "success",
      ModalTitle: "Email Sent...",
      ModalBody:
        "Email will be sent at " +
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
