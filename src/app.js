let express = require("express");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);
// { reconnect: false }
// let stream = require("./ws/stream");
let path = require("path");
let favicon = require("serve-favicon");
let port = process.env.PORT || 3000;

app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let len = 0;
io.of("/stream").on("connection", (socket) => {
  socket.on("subscribe", (data) => {
    //subscribe/join a room
    socket.join(data.room);
    socket.join(data.socketId);

    //Inform other members in the room of new user's arrival
    len = socket.adapter.rooms[data.room].length;
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
  if (len > 10) {
    res.status(200).send("maxi reached");
    len = 0;
  } else {
    res.status(200).send("maxi not reached");
  }
});

server.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});
