const express = require("express");
const DateFormat = require("dateformat");
const router = new express.Router();

const GroupMessages = require("../models/groupmessages");
const DelayGroupMessages = require("../models/delaygroupmessages");

var Filter = require("bad-words");
var filter = new Filter();

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

    groupChat.messages = groupChat.messages.filter((message) => {
      return message._id != req.body.messageid;
    });
    await groupChat.save();

    req.app.get("socketio").emit("groupmessages__deletemessage", {
      _id: req.body.messageid,
    });

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

    var data = {
      text: filter.clean(req.body.text),
      displayname: req.body.displayname,
      senderemail: req.body.senderemail,
      avatarUrl: req.body.avatarUrl,
      date: req.body.date,
      time: req.body.time,
      seenArr: groupChat.members.map((member) => {
        return { email: member.email, seen: false };
      }),
    };

    groupChat.messages.push(data);
    await groupChat.save();

    data.date = DateFormat(data.date, "mmm dS, yyyy");

    req.app.get("socketio").emit("groupmessages__newmessage", {
      _id: groupChat._id,
      name: groupChat.name,
      text: data.text,
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
      var data = {
        groupid: req.body.groupid,
        name: req.body.groupname,
        messages: [
          {
            text: filter.clean(req.body.text),
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
      var data = {
        text: filter.clean(req.body.text),
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

module.exports = router;
