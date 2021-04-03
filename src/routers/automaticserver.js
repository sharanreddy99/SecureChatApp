const CronJob = require("cron").CronJob;
const DateFormat = require("dateformat");
const pusher = require("../db/pusher");

const DirectMessages = require("../models/directmessages");
const DelayDirectMessages = require("../models/delaydirectmessages");
const GroupMessages = require("../models/groupmessages");
const DelayGroupMessages = require("../models/delaygroupmessages");
const Emails = require("../models/emails");
const DelayEmails = require("../models/delayemails");

async function updateDelayedDirectMessages() {
  try {
    const date = DateFormat(new Date(), "yyyy-mm-dd");
    const time = DateFormat(new Date(), "HH:MM");

    const DMS = await DelayDirectMessages.find({ date: date, time: time });

    for (var i = 0; i < DMS.length; i++) {
      var directMessage = new DirectMessages({
        text: DMS[i].text,
        senderemail: DMS[i].senderemail,
        receiveremail: DMS[i].receiveremail,
        date: DMS[i].date,
        time: DMS[i].time,
      });
      await directMessage.save();
    }

    var delayedMessages = DMS;
    for (var i = 0; i < delayedMessages.length; i++) {
      delayedMessages[i].date = DateFormat(
        delayedMessages[i].date,
        "mmm dS, yyyy"
      );
    }

    await pusher.trigger("directmessages", "delayedmessages", {
      delayedMessages: delayedMessages,
    });

    await DelayDirectMessages.deleteMany({
      date: date,
      time: time,
    });

    return true;
  } catch (e) {
    console.log(e);
  }
}

async function updateDelayedGroupMessages() {
  try {
    const date = DateFormat(new Date(), "yyyy-mm-dd");
    const time = DateFormat(new Date(), "HH:MM");

    const DGMS = await DelayGroupMessages.find({
      messages: {
        $elemMatch: {
          date: date,
          time: time,
        },
      },
    });

    for (var i = 0; i < DGMS.length; i++) {
      var groupChat = await GroupMessages.findOne({
        _id: DGMS[i].groupid,
        name: DGMS[i].name,
      });

      if (groupChat == null) {
        DGMS[i].messages = DGMS[i].messages.filter((message) => {
          return message.date !== date && message.time !== time;
        });
        await DGMS[i].save();
        return true;
      }

      var newMessages = JSON.parse(JSON.stringify(DGMS[i].messages));
      newMessages = newMessages.filter((message) => {
        return message.date === date && message.time === time;
      });

      for (let j = 0; j < newMessages.length; j++) {
        newMessages[j].seenArr = groupChat.members.map((member) => {
          return { email: member.email, seen: false };
        });
        groupChat.messages.push(newMessages[j]);
      }

      await groupChat.save();

      for (var j = 0; j < newMessages.length; j++) {
        newMessages[j].date = DateFormat(newMessages[j].date, "mmm dS, yyyy");
      }

      await pusher.trigger("groupmessages", "delayedmessages", {
        delayedMessages: newMessages,
        _id: DGMS[i].groupid,
        name: DGMS[i].name,
      });

      newMessages = DGMS[i].messages.filter((message) => {
        return !(message.date === date && message.time === time);
      });

      if (newMessages.length == 0) {
        await DelayGroupMessages.deleteOne({
          groupid: DGMS[i].groupid,
          name: DGMS[i].name,
        });
      } else {
        DGMS[i].messages = newMessages;
        await DGMS[i].save();
      }
    }

    return true;
  } catch (e) {
    console.log(e);
  }
}

async function updateDelayedEmails() {
  try {
    const date = DateFormat(new Date(), "yyyy-mm-dd");
    const time = DateFormat(new Date(), "HH:MM");

    const emails = await DelayEmails.find({ date: date, time: time });

    for (var i = 0; i < emails.length; i++) {
      var email = new Emails({
        text: emails[i].text,
        senderemail: emails[i].senderemail,
        receiveremail: emails[i].receiveremail,
        date: emails[i].date,
        time: emails[i].time,
        subject: emails[i].subject,
      });
      await email.save();
    }

    var delayedEmails = emails;
    for (var i = 0; i < delayedEmails.length; i++) {
      delayedEmails[i].date = DateFormat(delayedEmails[i].date, "mmm dS, yyyy");
    }

    await pusher.trigger("emails", "delayedemails", {
      delayedEmails: delayedEmails,
    });

    await DelayEmails.deleteMany({
      date: date,
      time: time,
    });

    return true;
  } catch (e) {
    console.log(e);
  }
}

var autoComputeAll = new CronJob(
  "0 0/1 * 1/1 * *",
  async function () {
    try {
      await updateDelayedDirectMessages();
      await updateDelayedGroupMessages();
      await updateDelayedEmails();
    } catch (e) {
      console.log(e);
    }
  },
  null,
  true
);
