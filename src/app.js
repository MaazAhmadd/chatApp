let express = require("express");
let app = express();
const fs = require("fs");
var cors = require("cors");
let port = process.env.PORT || 443;
const httpsServer = require("https")
  .createServer(
    {
      // cert: fs.readFileSync("cannachan_chat.crt"),
      // ca: fs.readFileSync("cannachan_chat.ca-bundle"),
      cert: fs.readFileSync("server.cert"),
      key: fs.readFileSync("server.key"),
      // key: fs.readFileSync("private.key"),
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

app.use(cors());
app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.of("/stream").on("connection", stream);

// server.listen(3000);
