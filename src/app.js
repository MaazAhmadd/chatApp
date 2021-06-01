let express = require("express");
let app = express();
// const fs = require("fs");
var cors = require("cors");
let maxusers = require("./maxusers");
let port = process.env.PORT || 3000;
// const httpsServer = require("https")
//   .createServer(
//     {
//       cert: fs.readFileSync("cert.crt"),
//       ca: fs.readFileSync("ca.crt.ca-bundle"),
//       key: fs.readFileSync("private.key"),
//       // cert: fs.readFileSync("server.cert"),
//       // key: fs.readFileSync("server.key"),
//     },
//     app
//   )
// .listen(port, function () {
//   console.log(`Listening on port ${port}...`);
// });
let server = require("http").Server(app);
let io = require("socket.io")(server);
let stream = require("./ws/stream");
let path = require("path");
let favicon = require("serve-favicon");

app.use(cors());
app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  if (req.body.maxusers) {
    maxusers.setmaxusers(req.body.maxusers);
  } else if (req.body.n) {
    maxusers.incrementlocal();
  } else {
    res.send("ok");
  }
});
app.get("/check", (req, res) => {
  if (maxusers.getlocalmaxuser > maxusers.getmaxusers) {
    res.status(200).send("maxusers reached");
  } else {
    res.status(200).send("maxusers not reached");
  }
});

io.of("/stream").on("connection", stream);

server.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
