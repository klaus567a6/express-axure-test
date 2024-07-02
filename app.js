const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());

app.use(cors());

let code = "";
let peopleInSession = [];
let driver = "";
let mapLocation = "default";

app.get("/reset", (req, res) => {
  code = 0;
  peopleInSession = [];
  driver = "";	
  mapLocation = "default";
  console.log("reset successful");
  res.send("reset successful");
});

app.post("/code", (req, res) => {
  code = req.body.code;
  driver = req.body.username;
  console.log("code updated to", code);
  console.log("driver: ", driver);
  res.send("code updated");
});

app.get("/code", (req, res) => {
  res.send(code.toString());
});

app.get("/peopleInSession", (req, res) => {
  let response = "" + driver + "\n" + "\n";
  for (let i = 0; i < peopleInSession.length; i++) {
    response += peopleInSession[i];
    if (i < peopleInSession.length - 1) { // Check to avoid adding a newline at the end
      response += "\n \n";
    }
  }
  res.send(response);
});

app.post("/joinSession", (req, res) => {
  peopleInSession.push(req.body.username);
  console.log("people in session:", peopleInSession);
  res.send("joined session");
});

// GET route to retrieve the current driver
app.get("/driver", (req, res) => {
  res.send(driver);
});

// POST route to set the driver
app.post("/driver", (req, res) => {
  driver = req.body.driver;
  console.log("Driver updated to", driver);
  res.send("Driver updated");
});

app.get("/mapLocation", (req, res) => {
  res.send(mapLocation);
});

app.post("/mapLocation", (req, res) => {
  mapLocation = req.body.destination;
  console.log("Map location updated to", mapLocation);
  res.send("Map location updated");
});

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
