const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());

app.use(cors());

let code = "";
let peopleInSession = [];
let driver = "";

app.get("/reset", (req, res) => {
  code = 0;
  peopleInSession = [];
  res.send("reset successful");
});

app.post("/code", (req, res) => {
  code = req.body.code;
  console.log("code updated to", code);
  res.send("code updated");
});

app.get("/code", (req, res) => {
  res.send(code.toString());
});

app.get("/peopleInSession", (req, res) => {
  res.send(peopleInSession);
});

app.post("/joinSession", (req, res) => {
  peopleInSession.push(req.body.name);
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

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
