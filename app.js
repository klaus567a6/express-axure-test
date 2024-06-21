const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

let state = "state1";

app.get("/", (req, res) => {
  res.send(state);
});

app.post("/", (req, res) => {
  if (state === "state1") {
    state = "state2";
  } else if (state === "state2") {
    state = "state3";
  } else {
    state = "state1";
  }
  res.send("State updated");
});

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
