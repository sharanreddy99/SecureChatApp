const mongoose = require("mongoose");

const delayGroupMessagesSchema = mongoose.Schema({
  groupid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  messages: [
    {
      text: {
        type: String,
        required: true,
      },
      displayname: {
        type: String,
        required: true,
      },
      senderemail: {
        type: String,
        required: true,
      },
      avatarUrl: {
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
        },
      ],
    },
  ],
});

const DelayGroupMessages = mongoose.model(
  "delaygroupmessages",
  delayGroupMessagesSchema
);
module.exports = DelayGroupMessages;
