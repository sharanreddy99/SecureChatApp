const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/mongoose");

const path = require("path");
const ProjectURL = path.join(__dirname, "Securechats");

const directMessagesRouter = require("./routers/directmessages");
const usersRouter = require("./routers/users");
const emailRouter = require("./routers/emails");

require("./routers/automaticserver");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(ProjectURL));

app.use("", directMessagesRouter);
app.use("", usersRouter);
app.use("", emailRouter);

app.get("*", function (req, res) {
  res.sendFile(path.join(ProjectURL + "/index.html"));
});

module.exports = app;
