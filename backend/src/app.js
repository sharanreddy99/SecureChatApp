const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/mongoose");

const directMessagesRouter = require("./routers/directmessages");
const usersRouter = require("./routers/users");

require("./routers/automaticserver");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", directMessagesRouter);
app.use("/api", usersRouter);

module.exports = app;
