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
let song = "No Song is playing!";
let artist = "No Artist";
let rolesinsession = "";
let albumimage = "";
let lyrics = "";
let count = 0;
let Play0 = -1;
let Play1 = -1;
let Play2 = -1;
let Play3 = -1;
let Play4 = -1;


app.get("/reset", (req, res) => {
  code = 0;
  peopleInSession = [];
  driver = "";	
  mapLocation = "default";
  song = "No Song is playing!";
  artist = "No Artist";
  rolesinsession = "";
  albumimage = "";
  lyrics = "";
  count = 0;
  Play0 = -1;
  Play1 = -1;
  Play2 = -1;
  Play3 = -1;
  Play4 = -1;
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
  let response1 = "" + driver + "\n" + "\n";
  rolesinsession = "Driver" + "\n" + "\n";
  for (let i = 0; i < peopleInSession.length; i++) {
    response1 += peopleInSession[i];
    rolesinsession += "Passenger";
    if (i < peopleInSession.length - 1) { // Check to avoid adding a newline at the end
      response1 += "\n \n";
      rolesinsession += "\n \n";

    }
  }
  res.json({people: response1, rolesinsession: rolesinsession});
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

app.post("/song", (req, res) => {
  song = req.body.song;
  artist = req.body.artist;
  albumimage = req.body.albumimage;
  lyrics = req.body.lyrics;
  console.log("Song updated to", song);
  res.send("Song updated");
});

app.get("/song", (req, res) => {
  res.json({ song: song, artist: artist, albumimage: albumimage });
});

app.post("/playlist", (req, res) => {
  count = req.body.count;
  Play0 = req.body.Play0;
  Play1 = req.body.Play1;
  Play2 = req.body.Play2;
  Play3 = req.body.Play3;
  Play4 = req.body.Play4;
  console.log("Playlist updated to", count);
  res.send("Playlist updated");
});

app.get("/playlist", (req, res) => {
  res.json({ count: count, Play0: Play0, Play1: Play1, Play2: Play2, Play3: Play3, Play4: Play4 });
});

app.get("/lyrics", (req, res) => {
  res.json({ lyrics: lyrics, song: song });
});

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
