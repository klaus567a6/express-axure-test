// Express Boilerplate
const express = require("express");
const app = express();
const hostname = process.env.YOUR_HOST || "0.0.0.0";
const PORT = process.env.PORT || 3001;
const http = require("http");
const server = http.createServer(app);

//serving public file
app.use(express.static(__dirname));


app.get("/", function(req, res) {
  res.type('html').send(index.html)
});

server.listen(PORT, hostname, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
  if (hostname == "0.0.0.0" && PORT === "4000" ) {
    console.log('Server running locally');
  } else {
    console.log('Server running externally');
  }
});