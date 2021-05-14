const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  displayname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatarUrl: {
    type: String,
    required: true,
  },
  connections: [
    {
      email: {
        type: String,
        required: true,
      },
      displayname: {
        type: String,
        required: true,
      },
      avatarUrl: {
        type: String,
        required: true,
      },
      accepted: {
        type: Boolean,
        default: false,
      },
      isSender: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

const Users = mongoose.model("users", usersSchema);
module.exports = Users;
