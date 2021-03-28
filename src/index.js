const app = require("./app");
const port = process.env.PORT_LOCAL;
app.listen(port, (err) => {
  if (err) {
    console.log("Error Occured Sharan Reddy");
  }
  console.log("Server is Running Sharan Reddy at : ", port);
});
