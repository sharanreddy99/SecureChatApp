const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/mongoose");

const path = require("path");
const ProjectURL = path.join(__dirname, "build");

const directMessagesRouter = require("./routers/directmessages");
const groupMessagesRouter = require("./routers/groupmessages");
const usersRouter = require("./routers/users");
const emailRouter = require("./routers/emails");

const app = express();
app.use(cors());
app.use(express.json());

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
  path: "/web_socket_server/",
});
app.set("socketio", io);

require("./routers/automaticserver")(io);

app.use(express.static(ProjectURL));

app.use("/api", directMessagesRouter);
app.use("/api", groupMessagesRouter);
app.use("/api", usersRouter);
app.use("/api", emailRouter);

app.get("*", function (req, res) {
  res.sendFile(path.join(ProjectURL + "/index.html"));
});

io.on("connection", (client) => {
  console.log("client: ", client.id);
});

module.exports = { socketio: io, server: server };
