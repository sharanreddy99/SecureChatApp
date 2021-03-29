const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/mongoose");

// const path = require("path");
// const ProjectURL = path.join(__dirname, "Securechats");

const directMessagesRouter = require("./routers/directmessages");
const groupMessagesRouter = require("./routers/groupmessages");
const usersRouter = require("./routers/users");
const emailRouter = require("./routers/emails");

require("./routers/automaticserver");

const app = express();
app.use(cors());
app.use(express.json());
// app.use(express.static(ProjectURL));

app.use("/api", directMessagesRouter);
app.use("/api", groupMessagesRouter);
app.use("/api", usersRouter);
app.use("/api", emailRouter);

// app.get("*", function (req, res) {
//   res.sendFile(path.join(ProjectURL + "/index.html"));
// });

module.exports = app;
