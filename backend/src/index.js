const app = require("./app");
const port = process.env.PORT;
app.listen(4201, (err) => {
  if (err) {
    console.log("Error Occured Sharan Reddy");
  }
  console.log("Server is Running Sharan Reddy at : ", port);
});
