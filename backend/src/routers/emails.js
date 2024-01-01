const express = require("express");
const DateFormat = require("dateformat");
const router = new express.Router();
const multer = require("multer");
const fs = require("fs-extra");

const Emails = require("../models/emails");
const DelayEmails = require("../models/delayemails");
const EmailGroups = require("../models/emailgroups");
const randomstring = require("randomstring");

var filenames = [];

const storage = multer.diskStorage({
  destination: "./src/files/",
  filename: (req, file, cb) => {
    filenames.push({
      oldfilename: file.originalname,
      newfilename: randomstring.generate(10),
    });
    cb(null, filenames[filenames.length - 1].newfilename);
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
        receiveremails: newEmails,
        attachments: filenames,
        subject: req.body.subject,
        date: req.body.date,
        time: req.body.time,
        seenArr: newEmails.map((row) => {
          return { email: row, seen: false };
        }),
      });

      await newMail.save();

      const mailOptions = {
        from: process.env.SECURECHAT_NODE_EMAIL,
        to: newEmails,
        subject: req.body.subject,
        text: req.body.text,
        attachments: filenames.map((file) => ({
          filename: file.oldfilename,
          path: "./src/files/" + file.oldfilename,
        })),
      };

      filenames.forEach((file) =>
        fs.rename(
          "./src/files/" + file.newfilename,
          "./src/files/" + file.oldfilename
        )
      );

      transporter.sendMail(mailOptions, async function (err, data) {
        if (err) {
          console.log(err);
          await filenames.forEach((file) =>
            fs.unlinkSync("./src/files/" + file.oldfilename)
          );
          return res.status(500).send({ msg: "Can't send email right now." });
        }
        await filenames.forEach((file) =>
          fs.unlinkSync("./src/files/" + file.oldfilename)
        );
        res.status(201).send("Email Sent Successfully");
      });

      filenames = [];
    });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

router.post("/delaymail", (req, res) => {
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

      const newMail = new DelayEmails({
        text: req.body.text,
        senderemail: req.body.email,
        receiveremails: newEmails,
        attachments: filenames,
        subject: req.body.subject,
        date: req.body.date,
        time: req.body.time,
        seenArr: newEmails.map((row) => {
          return { email: row, seen: false };
        }),
      });

      if (DateFormat(req.body.date + " " + req.body.time) <= DateFormat()) {
        return res.status(200).send({
          status: "failure",
          ModalTitle: "Past Date and Time Chosen...",
          ModalBody: "Please choose a valid date and time in the future...",
        });
      }

      await newMail.save();
      filenames = [];
      res.status(201).send({
        status: "success",
        ModalTitle: "Email Sent...",
        ModalBody:
          "Email will be sent at " +
          DateFormat(
            req.body.date + " " + req.body.time,
            "mmm dS, yyyy hh:MM TT"
          ),
      });
    });
  } catch (e) {
    console.log(e);
    res.status(401).send({
      status: "failure",
      ModalTitle: "Server Error...",
      ModalBody: "Internal Server Error Occured...",
    });
  }
});

router.post("/fetchsentmail", async (req, res) => {
  try {
    const allEmails = await Emails.find(
      {
        senderemail: req.body.email,
        isSentDeleted: false,
      },
      null,
      {
        sort: { date: -1, time: -1 },
      }
    );

    var changeAllEmails = allEmails.map((email) => {
      email.date = DateFormat(email.date, "mmm dS, yyyy");
      return email;
    });

    res.status(201).send({ emails: changeAllEmails });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

router.post("/deletesentmail", async (req, res) => {
  try {
    var email = await Emails.findOne({
      _id: req.body.mailid,
    });

    email.isSentDeleted = true;
    if (email.seenArr.every((row) => row.isInboxDeleted)) {
      await email.remove();
    } else {
      await email.save();
    }

    res.status(201).send({ status: "success" });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

router.post("/deleteallsentmails", async (req, res) => {
  try {
    var allEmails = await Emails.find({
      senderemail: req.body.email,
    });

    for (let i = 0; i < allEmails.length; i++) {
      allEmails[i].isSentDeleted = true;
      if (allEmails[i].seenArr.every((row) => row.isInboxDeleted)) {
        await allEmails[i].remove();
      } else {
        await allEmails[i].save();
      }
    }

    res.status(201).send({ status: "success" });
  } catch (e) {
    console.log(e);
    res.status(401).send({ status: "failure" });
  }
});

router.post("/fetchinboxmail", async (req, res) => {
  try {
    const allEmails = await Emails.find(
      {
        receiveremails: req.body.email,
        seenArr: {
          $elemMatch: {
            email: req.body.email,
            isInboxDeleted: false,
          },
        },
      },
      null,
      {
        sort: { date: -1, time: -1 },
      }
    );

    var inboxMails = allEmails.map((email) => ({
      senderemail: email.senderemail,
      subject: email.subject,
      text: email.text,
      date: email.date,
      time: email.time,
      _id: email._id,
    }));

    res.status(201).send({ emails: inboxMails });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

router.post("/fetchspecificinboxmail", async (req, res) => {
  try {
    const allEmails = await Emails.find(
      {
        receiveremails: req.body.email,
        senderemail: req.body.connectionemail,
        seenArr: {
          $elemMatch: {
            email: req.body.email,
            isInboxDeleted: false,
          },
        },
      },
      null,
      {
        sort: { date: -1, time: -1 },
      }
    );

    var inboxMails = allEmails.map((email) => ({
      senderemail: email.senderemail,
      subject: email.subject,
      text: email.text,
      date: email.date,
      time: email.time,
      _id: email._id,
    }));

    res.status(201).send({ emails: inboxMails });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

router.post("/deleteinboxmail", async (req, res) => {
  try {
    var email = await Emails.findOne({
      _id: req.body.mailid,
    });

    email.seenArr.map((row) => {
      if (row.email == req.body.email) {
        row.isInboxDeleted = true;
      }
      return row;
    });

    if (
      email.seenArr.every((row) => row.isInboxDeleted) &&
      email.isSentDeleted
    ) {
      await email.remove();
    } else {
      await email.save();
    }

    res.status(201).send({ status: "success" });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

router.post("/deleteallinboxmails", async (req, res) => {
  try {
    var allEmails = await Emails.find({
      receiveremails: req.body.email,
    });

    for (let i = 0; i < allEmails.length; i++) {
      allEmails[i].seenArr.map((row) => {
        if (row.email == req.body.email) {
          row.isInboxDeleted = true;
        }
        return row;
      });
      if (
        allEmails[i].seenArr.every((row) => row.isInboxDeleted) &&
        allEmails[i].isSentDeleted
      ) {
        await allEmails[i].remove();
      } else {
        await allEmails[i].save();
      }
    }

    res.status(201).send({ status: "success" });
  } catch (e) {
    console.log(e);
    res.status(401).send({ status: "failure" });
  }
});

router.post("/fetchunseenemailscount", async (req, res) => {
  try {
    const allEmails = await Emails.find(
      {
        receiveremails: req.body.email,
        seenArr: {
          $elemMatch: {
            email: req.body.email,
            seen: false,
          },
        },
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
      receiveremails: req.body.email,
      senderemail: req.body.connectionemail,
      seenArr: {
        $elemMatch: {
          email: req.body.email,
          seen: false,
        },
      },
    });

    var seeAllEmails = allEmails.map(async (email) => {
      email.seenArr.map((row) => {
        if (row.email === req.body.email) {
          row.seen = true;
        }
        return row;
      });
      await email.save();
      return email;
    });

    res.status(201).send({ status: "success" });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

module.exports = router;
