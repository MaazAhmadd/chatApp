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
let io = require("socket.io")(
  server
  // { reconnect: false }
);
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

app.post("/sendmaxuser", (req, res) => {
  maxusers.setmaxusers(0);
  maxusers.setmaxusers(req.body.maxusers);
  res.status(200).send("everything ok");
});
let len = 0;
io.of("/stream").on("connection", (socket) => {
  socket.on("subscribe", (data) => {
    //subscribe/join a room
    socket.join(data.room);
    socket.join(data.socketId);

    //Inform other members in the room of new user's arrival
    len = socket.adapter.rooms[data.room].length + len;
    if (socket.adapter.rooms[data.room].length > 1) {
      socket.to(data.room).emit("new user", { socketId: data.socketId });
    }
  });

  socket.on("newUserStart", (data) => {
    socket.to(data.to).emit("newUserStart", { sender: data.sender });
  });

  socket.on("sdp", (data) => {
    socket
      .to(data.to)
      .emit("sdp", { description: data.description, sender: data.sender });
  });

  socket.on("ice candidates", (data) => {
    socket.to(data.to).emit("ice candidates", {
      candidate: data.candidate,
      sender: data.sender,
    });
  });

  socket.on("chat", (data) => {
    socket.to(data.room).emit("chat", { sender: data.sender, msg: data.msg });
  });
});
app.get("/checkmaxi", (req, res) => {
  if (len > maxusers.getmaxusers()) {
    res.status(200).send("maxi reached");
    len = 0;
  } else {
    res.status(200).send("maxi not reached");
  }
});

server.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
