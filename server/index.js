const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('کاربر متصل شد:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', socket.id);
  });

  socket.on('send-message', (data) => {
    io.to(data.roomId).emit('message-received', data);
  });

  socket.on('offer', (data) => {
    socket.to(data.to).emit('offer', { from: socket.id, sdp: data.sdp });
  });

  socket.on('answer', (data) => {
    socket.to(data.to).emit('answer', { from: socket.id, sdp: data.sdp });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.to).emit('ice-candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('کاربر قطع شد:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 سرور در پورت ${PORT} فعال است`);
  console.log(`باز کن در مرورگر: http://localhost:${PORT}`);
});
