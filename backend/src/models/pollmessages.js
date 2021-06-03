const mongoose = require("mongoose");

const pollMessagesSchema = mongoose.Schema({
  pollid: {
    type: String,
    required: true,
  },
  responses: {
    yes: [
      {
        type: String,
        required: true,
      },
    ],
    no: [
      {
        type: String,
        required: true,
      },
    ],
  },
});

const PollMessages = mongoose.model("pollmessages", pollMessagesSchema);
module.exports = PollMessages;
