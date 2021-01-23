const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1139231",
  key: "11a8dd35181269e15a84",
  secret: "e12708e877aefef28c63",
  cluster: "ap2",
  useTLS: true,
});

module.exports = pusher;
