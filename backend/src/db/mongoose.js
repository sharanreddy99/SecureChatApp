const mongoose = require("mongoose");

mongoose.connect(process.env.SECURECHAT_NODE_MONGOURL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
