const mongoose = require("mongoose");

const delayEmailsSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  senderemail: {
    type: String,
    required: true,
  },
  attachments: [
    {
      oldfilename: {
        type: String,
        required: true,
      },
      newfilename: {
        type: String,
        required: true,
      },
    },
  ],
  receiveremails: [
    {
      type: String,
      required: true,
    },
  ],
  subject: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  seenArr: [
    {
      email: {
        type: String,
        required: true,
      },
      seen: {
        default: false,
        type: Boolean,
      },
      isInboxDeleted: {
        default: false,
        type: Boolean,
      },
    },
  ],
  isSentDeleted: {
    default: false,
    type: Boolean,
  },
});

const DelayEmails = mongoose.model("delayemails", delayEmailsSchema);
module.exports = DelayEmails;
