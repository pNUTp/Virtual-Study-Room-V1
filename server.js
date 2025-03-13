const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (adjust for security)
    methods: ["GET", "POST"],
  },
});

const PORT = 5000;

app.use(cors());
app.use(express.json());

let messages = [];

// Default route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send existing messages when a user connects
  socket.emit("load_messages", messages);

  // Handle incoming messages
  socket.on("send_message", (data) => {
    messages.push(data);
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
