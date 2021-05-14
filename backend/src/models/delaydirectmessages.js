const mongoose = require("mongoose");

const delayDirectMessagesSchema = mongoose.Schema({
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
});

const DelayDirectMessages = mongoose.model(
  "delaydirectmessages",
  delayDirectMessagesSchema
);
module.exports = DelayDirectMessages;
