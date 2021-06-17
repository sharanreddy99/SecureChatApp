const express = require("express");
const DateFormat = require("dateformat");
const router = new express.Router();

const GroupMessages = require("../models/groupmessages");
const DelayGroupMessages = require("../models/delaygroupmessages");

var Filter = require("bad-words");
const PollMessages = require("../models/pollmessages");
var filter = new Filter();
const encryptor = require("simple-encryptor")(process.env.SECURECHAT_NODE_SECRET_KEY);

router.post("/exitgroup", async (req, res) => {
  try {
    var groupChat = await GroupMessages.findOne(
      {
        _id: req.body.groupid,
        name: req.body.groupname,
      },
      null
    );

    if (groupChat.owner === req.body.email) {
      if (groupChat.admin.length <= 1) {
        throw new Error();
      }
      groupChat.members = groupChat.members.filter(
        (member) => member.email !== req.body.email
      );
      groupChat.admin = groupChat.admin.filter(
        (row) => row.email !== req.body.email
      );
      groupChat.owner = groupChat.admin[0].email;
    } else {
      groupChat.members = groupChat.members.filter(
        (member) => member.email !== req.body.email
      );
      groupChat.admin = groupChat.admin.filter(
        (row) => row.email !== req.body.email
      );
    }
    await groupChat.save();
    res.status(200).send({ status: "success" });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

router.post("/fetchgroups", async (req, res) => {
  try {
    const groups = await GroupMessages.find(
      {
        $or: [
          {
            members: {
              $elemMatch: {
                email: req.body.email,
              },
            },
          },
        ],
      },
      { _id: 1, name: 1, pictureUrl: 1, owner: 1, admin: 1, members: 1 }
    );

    res.status(200).send({ status: "success", groups: groups });
  } catch (e) {
    console.log(e);
    res.status(401).send({ status: "failure" });
  }
});

router.post("/creategroup", async (req, res) => {
  try {
    var imageURL = req.body.imageurl;
    var groupChat = null;
    if (imageURL) {
      groupChat = new GroupMessages({
        name: req.body.groupname,
        owner: req.body.user.email,
        pictureUrl: imageURL,
        admin: [{ email: req.body.user.email }],
        members: [req.body.user],
      });
    } else {
      groupChat = new GroupMessages({
        name: req.body.groupname,
        owner: req.body.user.email,
        admin: [{ email: req.body.user.email }],
        members: [req.body.user],
      });
    }

    await groupChat.save();

    req.app.get("socketio").emit("groupmessages__newgroup", {
      _id: groupChat._id,
      name: groupChat.name,
      owner: groupChat.owner,
      pictureUrl: groupChat.pictureUrl,
      admin: groupChat.admin,
      members: groupChat.members,
    });

    res.status(201).send(groupChat);
  } catch (e) {
    res.status(401).send({ error: "error" });
  }
});

router.post("/deletegroup", async (req, res) => {
  try {
    var groupChat = await GroupMessages.findOne({
      _id: req.body.groupid,
      name: req.body.groupname,
    });

    if (!groupChat) {
      throw new Error("Group Chat not found");
    }

    if (groupChat.owner != req.body.email) {
      throw new Error("User is not an owner");
    }

    var tempgroupid = groupChat._id;
    var tempgroupname = groupChat.name;
    await GroupMessages.deleteOne({
      _id: groupChat._id,
      name: groupChat.name,
    });

    await DelayGroupMessages.deleteOne({
      groupid: tempgroupid,
      name: tempgroupname,
    });

    req.app.get("socketio").emit("groupmessages__deletegroup", {
      _id: groupChat._id,
      name: groupChat.name,
    });

    res.status(201).send({ msg: "success" });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

router.post("/updategroupmessage", async (req, res) => {
  try {
    var groupChat = await GroupMessages.findOne({
      _id: req.body.groupid,
      name: req.body.groupname,
    });

    if (!groupChat) {
      throw new Error("Group Chat not found");
    }

    var isChanged = false;
    var updatedMessage = null;

    groupChat.messages = groupChat.messages.map((message) => {
      if (
        message._id == req.body.message._id &&
        message.senderemail == req.body.senderemail
      ) {
        isChanged = true;
        message.text = encryptor.encrypt(filter.clean(req.body.newmessage));
        updatedMessage = message;
      }
      return message;
    });

    if (isChanged) {
      await groupChat.save();

      updatedMessage.text = encryptor.decrypt(updatedMessage.text);

      req.app.get("socketio").emit("groupmessages__updatemessage", {
        _id: groupChat._id,
        name: groupChat.name,
        message: updatedMessage,
      });
    }
    res.status(201).send({ msg: "success" });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

router.post("/addmembers", async (req, res) => {
  try {
    var groupChat = await GroupMessages.findOne({
      _id: req.body.groupid,
      name: req.body.groupname,
    });

    if (!groupChat) {
      throw new Error("Group Chat not found");
    }

    var isAdmin = groupChat.admin.some((member) => {
      return member.email == req.body.email;
    });

    if (!isAdmin) {
      throw new Error("User is not an admin");
    }

    for (var i = 0; i < req.body.members.length; i++) {
      var inputMember = req.body.members[i];
      var memberExists = groupChat.members.some((member) => {
        return member.email == inputMember.email;
      });

      if (!memberExists) {
        groupChat.members.push(inputMember);
      }
    }

    await groupChat.save();

    req.app.get("socketio").emit("groupmessages__newgroup", {
      _id: groupChat._id,
      name: groupChat.name,
      owner: groupChat.owner,
      pictureUrl: groupChat.pictureUrl,
      admin: groupChat.admin,
      members: groupChat.members,
    });

    res.status(201).send({ msg: "success" });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

router.post("/removemembers", async (req, res) => {
  try {
    var groupChat = await GroupMessages.findOne({
      _id: req.body.groupid,
      name: req.body.groupname,
    });

    if (!groupChat) {
      throw new Error("Group Chat not found");
    }

    var isAdmin = groupChat.admin.some((member) => {
      return member.email == req.body.email;
    });

    if (!isAdmin) {
      throw new Error("User is not an admin");
    }

    if (req.body.members.some((member) => member.email === groupChat.email)) {
      throw new Error("User cannot remove the creator of the group");
    }

    for (var i = 0; i < req.body.members.length; i++) {
      var inputMember = req.body.members[i];

      groupChat.members = groupChat.members.filter((member) => {
        return member.email !== inputMember.email;
      });

      groupChat.admin = groupChat.admin.filter((member) => {
        return member.email !== inputMember.email;
      });
    }

    await groupChat.save();

    req.app.get("socketio").emit("groupmessages__removemembers", {
      _id: groupChat._id,
      name: groupChat.name,
      members: groupChat.members,
    });

    res.status(201).send({ msg: "success" });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

router.post("/makeadmins", async (req, res) => {
  try {
    var groupChat = await GroupMessages.findOne({
      _id: req.body.groupid,
      name: req.body.groupname,
    });

    if (!groupChat) {
      throw new Error("Group Chat not found");
    }

    var isAdmin = groupChat.admin.some((member) => {
      return member.email == req.body.email;
    });

    if (!isAdmin) {
      throw new Error("User is not an admin");
    }

    for (var i = 0; i < req.body.admins.length; i++) {
      inputAdmin = req.body.admins[i];

      var alreadyAdmin = groupChat.admin.some((member) => {
        return member.email == inputAdmin.email;
      });

      if (!alreadyAdmin) {
        groupChat.admin.push({ email: inputAdmin.email });
      }
    }

    await groupChat.save();

    req.app.get("socketio").emit("groupmessages__makeadmins", {
      _id: groupChat._id,
      name: groupChat.name,
      admin: groupChat.admin,
    });

    res.status(201).send({ msg: "success" });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

router.post("/removeadmins", async (req, res) => {
  try {
    var groupChat = await GroupMessages.findOne({
      _id: req.body.groupid,
      name: req.body.groupname,
    });

    if (!groupChat) {
      throw new Error("Group Chat not found");
    }

    var isAdmin = groupChat.admin.some((member) => {
      return member.email == req.body.email;
    });

    if (!isAdmin) {
      throw new Error("User is not an admin");
    }

    var isOwner = groupChat.owner == req.body.email;
    if (!isOwner && req.body.member.email == groupChat.owner) {
      throw new Error("Cannot remove owner as admin");
    }

    for (var i = 0; i < req.body.admins.length; i++) {
      inputAdmin = req.body.admins[i];

      groupChat.admin = groupChat.admin.filter((member) => {
        return member.email != inputAdmin.email;
      });
    }

    await groupChat.save();

    req.app.get("socketio").emit("groupmessages__removeadmins", {
      _id: groupChat._id,
      name: groupChat.name,
      admin: groupChat.admin,
    });

    res.status(201).send({ msg: "success" });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

router.post("/deletegroupmessage", async (req, res) => {
  try {
    var groupChat = await GroupMessages.findOne({
      _id: req.body.groupid,
      name: req.body.groupname,
    });

    var oldLen = groupChat.messages.length;
    groupChat.messages = groupChat.messages.filter((message) => {
      if (message._id == req.body.messageid) {
        if (groupChat.owner === req.body.email) {
          return false;
        }
        if (message.senderemail === req.body.email) {
          return false;
        }
        if (message.senderemail === groupChat.owner) {
          return true;
        }
        if (groupChat.admin.some((row) => row.email === req.body.email)) {
          return false;
        }
      }
      return true;
    });
    await groupChat.save();
    await PollMessages.deleteOne({ pollid: req.body.messageid });

    if (oldLen != groupChat.messages.length) {
      req.app.get("socketio").emit("groupmessages__deletemessage", {
        _id: req.body.messageid,
      });
    } else {
      throw new Error("Nothing deleted");
    }

    res.status(201).send({ msg: "success" });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

router.post("/sendgroupmessage", async (req, res) => {
  try {
    var groupChat = await GroupMessages.findOne(
      {
        _id: req.body.groupid,
        name: req.body.groupname,
      },
      null
    );

    if (Object.keys(groupChat).length == 0) {
      return res.status(201).send({ msg: "success" });
    }

    var rawtext = null;
    try {
      rawtext = encryptor.encrypt(filter.clean(req.body.text));
    } catch (e) {
      rawtext = encryptor.encrypt(req.body.text);
    }

    var data = {
      text: rawtext,
      displayname: req.body.displayname,
      senderemail: req.body.senderemail,
      avatarUrl: req.body.avatarUrl,
      date: req.body.date,
      time: req.body.time,
      seenArr: groupChat.members.map((member) => {
          let isSeen = false 
          if(member.email === req.body.senderemail) {
            isSeen = true
          }
          return {email: member.email, seen: isSeen };
      }),
    };

    groupChat.messages.push(data);
    await groupChat.save();

    data.date = DateFormat(data.date, "mmm dS, yyyy");

    req.app.get("socketio").emit("groupmessages__newmessage", {
      _id: groupChat._id,
      name: groupChat.name,
      text: encryptor.decrypt(data.text),
      displayname: data.displayname,
      senderemail: data.senderemail,
      avatarUrl: data.avatarUrl,
      date: data.date,
      time: data.time,
      messageid: groupChat.messages[groupChat.messages.length - 1]["_id"],
    });

    res.status(201).send({ msg: "success" });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

router.post("/fetchallgroupmessages", async (req, res) => {
  try {
    const allMessages = await GroupMessages.find(
      {
        _id: req.body.groupid,
        name: req.body.groupname,
        members: {
          $elemMatch: {
            email: req.body.email,
          },
        },
      },
      "messages",
      {
        sort: { "messages._id": 1 },
      }
    );

    var changeAllMessages = allMessages[0].messages.map((message) => {
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

router.post("/fetchunseengroupchatscount", async (req, res) => {
  try {
    const groupChats = await GroupMessages.find(
      {
        members: {
          $elemMatch: {
            email: req.body.email,
          },
        },
      },
      {
        _id: 1,
        name: 1,
        messages: 1,
      }
    );

    var unseencount = {};
    for (let i = 0; i < groupChats.length; i++) {
      unseencount[groupChats[i]._id] = 0;
    }

    for (let i = 0; i < groupChats.length; i++) {
      for (let j = 0; j < groupChats[i].messages.length; j++) {
        var isSeen = groupChats[i].messages[j].seenArr.some((val) => {
          return val.email === req.body.email && val.seen === false;
        });
        if (isSeen) {
          unseencount[groupChats[i]._id] += 1;
        }
      }
    }

    res.status(201).send({ unseencount: unseencount });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

router.post("/groupmessagesseen", async (req, res) => {
  try {
    const groupChat = await GroupMessages.findOne({
      _id: req.body.groupid,
      name: req.body.groupname,
    });

    if (Object.keys(groupChat).length == 0) {
      return res.status(201).send({ status: "success" });
    }

    groupChat.messages = groupChat.messages.map((message) => {
      var newSeenArr = message.seenArr.map((val) => {
        if (val.email === req.body.email) {
          val.seen = true;
        }
        return val;
      });
      message.seenArr = newSeenArr;
      return message;
    });

    await groupChat.save();

    res.status(201).send({ status: "success" });
  } catch (e) {
    res.status(401).send({ status: "failure" });
  }
});

router.post("/delaygroupmessage", async (req, res) => {
  try {
    var delayGroupChat = await DelayGroupMessages.findOne({
      groupid: req.body.groupid,
      name: req.body.groupname,
    });

    if (delayGroupChat === null) {
      let rawtext = null;
      try {
        rawtext = encryptor.encrypt(filter.clean(req.body.text));
      } catch (e) {
        rawtext = encryptor.encrypt(req.body.text);
      }
      var data = {
        groupid: req.body.groupid,
        name: req.body.groupname,
        messages: [
          {
            text: rawtext,
            displayname: req.body.displayname,
            senderemail: req.body.senderemail,
            avatarUrl: req.body.avatarUrl,
            date: req.body.date,
            time: req.body.time,
          },
        ],
      };

      if (DateFormat(data.date + " " + data.time) <= DateFormat()) {
        return res.status(200).send({
          status: "failure",
          ModalTitle: "Past Date and Time Chosen...",
          ModalBody: "Please choose a valid date and time in the future...",
        });
      }

      const delayChat = new DelayGroupMessages(data);
      await delayChat.save();
    } else {
      let rawtext = null;
      try {
        rawtext = encryptor.encrypt(filter.clean(req.body.text));
      } catch (e) {
        rawtext = encryptor.encrypt(req.body.text);
      }
      var data = {
        text: rawtext,
        displayname: req.body.displayname,
        senderemail: req.body.senderemail,
        avatarUrl: req.body.avatarUrl,
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

      delayGroupChat.messages.push(data);
      await delayGroupChat.save();
    }

    res.status(201).send({
      status: "success",
      ModalTitle: "Message Sent...",
      ModalBody:
        "Message will be sent at " +
        DateFormat(
          req.body.date + " " + req.body.time,
          "mmm dS, yyyy hh:MM TT"
        ),
    });
  } catch (e) {
    res.status(200).send({
      status: "failure",
      ModalTitle: "Server Error...",
      ModalBody: "Internal Server Error Occured...",
    });
  }
});

router.post("/createpoll", async (req, res) => {
  try {
    let groupid = req.body.groupid;
    let groupname = req.body.groupname;
    let pollname = req.body.pollname;
    let polldescription = req.body.polldescription;
    let expirydate = req.body.expirydate;
    let expirytime = req.body.expirytime;
    message = ["thispoll", pollname, polldescription].join("==|--");

    var groupChat = await GroupMessages.findOne(
      {
        _id: groupid,
        name: groupname,
      },
      null
    );

    var data = {
      text: encryptor.encrypt(message),
      displayname: req.body.displayname,
      senderemail: req.body.email,
      avatarUrl: req.body.avatarUrl,
      date: expirydate,
      time: expirytime,
      seenArr: groupChat.members.map((member) => {
        return { email: member.email, seen: false };
      }),
    };

    groupChat.messages.push(data);
    await groupChat.save();
    var pollMessage = new PollMessages({
      pollid: groupChat.messages[groupChat.messages.length - 1]["_id"],
      responses: { yes: [], no: [] },
    });
    await pollMessage.save();

    data.date = DateFormat(data.date, "mmm dS, yyyy");

    req.app.get("socketio").emit("groupmessages__newpoll", {
      _id: groupChat._id,
      name: groupChat.name,
      text: encryptor.decrypt(data.text),
      displayname: data.displayname,
      senderemail: data.senderemail,
      avatarUrl: data.avatarUrl,
      date: data.date,
      time: data.time,
      messageid: groupChat.messages[groupChat.messages.length - 1]["_id"],
    });
    res.status(201).send("success");
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

router.post("/updatepoll", async (req, res) => {
  try {
    let pollid = req.body.pollid;
    let pollresponse = req.body.pollresponse;
    let email = req.body.email;

    var pollMessage = await PollMessages.findOne(
      {
        pollid: pollid,
      },
      null
    );

    pollMessage.responses.yes = pollMessage.responses.yes.filter(
      (row) => row !== email
    );
    pollMessage.responses.no = pollMessage.responses.no.filter(
      (row) => row !== email
    );
    if (pollresponse === "yes") {
      pollMessage.responses.yes.push(email);
    } else {
      pollMessage.responses.no.push(email);
    }

    await pollMessage.save();
    res.status(201).send("success");
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

router.post("/fetchpollresult", async (req, res) => {
  try {
    let pollid = req.body.pollid;

    var pollMessage = await PollMessages.findOne(
      {
        pollid: pollid,
      },
      null
    );
    res.status(201).send({ responses: pollMessage.responses });
  } catch (e) {
    console.log(e);
    res.status(401).send({ error: "error" });
  }
});

module.exports = router;
