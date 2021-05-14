const mongoose = require("mongoose");

const emailGroupsSchema = mongoose.Schema({
  name: {
    type: String,
  },
  owner: {
    type: String,
    required: true,
  },
  receiveremails: [
    {
      type: String,
      required: true,
    },
  ],
});

const EmailGroups = mongoose.model("emailgroups", emailGroupsSchema);
module.exports = EmailGroups;
