const app = require("./app").server;
const port = process.env.SECURECHAT_NODE_PORT;
app.listen(port, (err) => {
  if (err) {
    console.log("Error Occured ");
  }
  console.log("Server is running at Port: ", port);
  console.log("MongoURL is: ", process.env.SECURECHAT_NODE_MONGOURL);
});
