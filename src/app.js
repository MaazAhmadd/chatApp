let express = require("express");
let app = express();
const fs = require("fs");
let port = process.env.PORT || 3000;
const httpsServer = require("https")
  .createServer(
    {
      cert: fs.readFileSync("cannachan_chat.crt"),
      ca: fs.readFileSync("cannachan_chat.ca-bundle"),
      // key: fs.readFileSync("./server.key"),
    },
    app
  )
  .listen(port, function () {
    console.log(`Listening on port ${port}...`);
  });
// let server = require("http").Server(app);
let io = require("socket.io")(httpsServer);
let stream = require("./ws/stream");
let path = require("path");
let favicon = require("serve-favicon");

app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.of("/stream").on("connection", stream);

// server.listen(3000);
