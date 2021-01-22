const CronJob = require("cron").CronJob;
const DateFormat = require("dateformat");
const pusher = require("../db/pusher");

const DirectMessages = require("../models/directmessages");
const DelayDirectMessages = require("../models/delaydirectmessages");

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

var autoComputeAll = new CronJob(
  "0 0/1 * 1/1 * *",
  async function () {
    try {
      await updateDelayedDirectMessages();
    } catch (e) {
      console.log(e);
    }
  },
  null,
  true
);
