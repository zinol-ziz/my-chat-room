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

// کاربران آنلاین
const users = {};
const rooms = ['عمومی'];
const reports = [];

io.on('connection', (socket) => {
  console.log('کاربر متصل شد:', socket.id);

  // ارسال اتاق‌ها
  socket.emit('rooms-list', rooms);

  // ارسال کاربران
  socket.emit('users-list', Object.values(users));

  // ورود کاربر
  socket.on('join', (userData) => {
    users[socket.id] = { ...userData, socketId: socket.id };
    socket.join('عمومی');
    io.emit('users-list', Object.values(users));
    io.to('عمومی').emit('message-received', {
      sender: 'سیستم',
      text: `${userData.name} وارد شد`,
      room: 'عمومی'
    });
  });

  // ارسال پیام
  socket.on('send-message', (data) => {
    io.to(data.room).emit('message-received', data);
  });

  // تماس صوتی/تصویری
  socket.on('offer', (data) => {
    socket.to(data.to).emit('offer', { from: socket.id, sdp: data.sdp });
  });

  socket.on('answer', (data) => {
    socket.to(data.to).emit('answer', { from: socket.id, sdp: data.sdp });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.to).emit('ice-candidate', data);
  });

  // گزارش پیام
  socket.on('report-message', (data) => {
    reports.push(data);
    // فقط به ادمین و معاون نمایش داده میشه
    Object.values(users).forEach(user => {
      if (user.role === 'ادمین' || user.role === 'معاون') {
        io.to(user.socketId).emit('new-report', data);
      }
    });
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      delete users[socket.id];
      io.emit('users-list', Object.values(users));
      io.to('عمومی').emit('message-received', {
        sender: 'سیستم',
        text: `${user.name} خارج شد`,
        room: 'عمومی'
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 سرور در پورت ${PORT} فعال است`);
});
