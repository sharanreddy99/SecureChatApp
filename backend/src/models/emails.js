const mongoose = require("mongoose");

const emailsSchema = mongoose.Schema({
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
  seen: {
    type: Boolean,
    default: false,
  },
});

const Emails = mongoose.model("emails", emailsSchema);
module.exports = Emails;
