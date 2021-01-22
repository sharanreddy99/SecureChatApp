const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOURL_LOCAL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
