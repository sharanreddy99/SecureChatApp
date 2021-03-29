const mongoose = require("mongoose");

const groupMessagesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pictureUrl: {
    type: String,
    required: true,
    default: "https://i.stack.imgur.com/l60Hf.png",
  },
  owner: {
    type: String,
    required: true,
  },
  admin: [
    {
      email: {
        type: String,
        required: true,
      },
    },
  ],
  members: [
    {
      displayname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      avatarUrl: {
        type: String,
        required: true,
      },
    },
  ],
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

const GroupMessages = mongoose.model("groupmessages", groupMessagesSchema);
module.exports = GroupMessages;
