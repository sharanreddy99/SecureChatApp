const express = require("express");
const DateFormat = require("dateformat");
const router = new express.Router();
const multer = require("multer");
const fs = require("fs-extra");

const Emails = require("../models/emails");
const DelayEmails = require("../models/delayemails");
const EmailGroups = require("../models/emailgroups");

const storage = multer.diskStorage({
  destination: "./src/files/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
}).array("customfiles");

router.post("/getemailgroups", async (req, res) => {
  try {
    const response = await EmailGroups.find({
      owner: req.body.owner,
    });

    res.status(201).send({ allgroups: response });
  } catch (e) {
    console.log(e);
    res.status(500).send({ err: "Internal server error..." });
  }
});

router.post("/createemailgroup", async (req, res) => {
  try {
    const response = await EmailGroups.findOne({
      name: req.body.name,
      owner: req.body.owner,
    });

    if (response !== null) {
      throw new Error();
    }

    const emailGroups = new EmailGroups({
      name: req.body.name,
      owner: req.body.owner,
      receiveremails: req.body.receiveremails,
    });

    await emailGroups.save();
    res.status(201).send({ msg: "Group created successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ err: "Can't create group" });
  }
});

router.post("/deleteemailgroups", async (req, res) => {
  try {
    for (let i = 0; i < req.body.emailgroups.length; i++) {
      await EmailGroups.deleteOne({
        name: req.body.emailgroups[i],
        owner: req.body.owner,
      });
    }
    res.status(201).send({ msg: "Groups deleted successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ err: "Not the owner of the group" });
  }
});

router.post("/sendmail", (req, res) => {
  try {
    upload(req, res, async () => {
      const toEmails = JSON.parse(req.body.toemails);

      const emailGroups = await EmailGroups.find({
        owner: req.body.email,
      });

      let newEmails = {};
      for (let i = 0; i < toEmails.length; i++) {
        let group = emailGroups.filter((row) => {
          return row.name === toEmails[i];
        });
        if (group.length > 0) {
          for (let j = 0; j < group[0].receiveremails.length; j++) {
            newEmails[group[0].receiveremails[j]] = true;
          }
        } else {
          newEmails[toEmails[i]] = true;
        }
      }

      newEmails = Object.keys(newEmails);

      const transporter = require("../miscellaneous/email");
      const newMail = new Emails({
        text: req.body.text,
        senderemail: req.body.email,
        receiveremail: newEmails,
        subject: req.body.subject,
        date: req.body.date,
        time: req.body.time,
        seenArr: newEmails.map((row) => {
          return { email: row, seen: false };
        }),
      });
      await newMail.save();

      const mailOptions = {
        from: "sharanreddyfake@gmail.com",
        to: newEmails,
        subject: req.body.subject,
        text: req.body.text,
        attachments: req.files.map((file) => ({
          filename: file.originalname,
          path: file.path,
        })),
      };

      transporter.sendMail(mailOptions, async function (err, data) {
        if (err) {
          console.log(err);
          await fs.emptyDirSync("./src/files/");
          return res.status(500).send({ msg: "Can't send email right now." });
        }
        console.log("success");
        await fs.emptyDir("./src/files/");
        res.status(201).send("Email Sent Successfully");
      });
    });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

router.post("/deleteemail", async (req, res) => {
  try {
    await Emails.deleteOne({ _id: req.body.message._id });
    req.app
      .get("socketio")
      .emit("emails__deleteemail", { _id: req.body.message._id });

    res.status(201).send({ msg: "success" });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

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

    req.app.get("socketio").emit("emails__newemail", {
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
