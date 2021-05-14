const mongoose = require("mongoose");

const directMessagesSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  senderemail: {
    type: String,
    required: true,
  },
  receiveremail: {
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
  seen: {
    type: Boolean,
    default: false,
  },
});

const DirectMessages = mongoose.model("directmessages", directMessagesSchema);
module.exports = DirectMessages;
