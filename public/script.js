let socket;
let userName = '';
let userRole = 'کاربر';

// --- ورود و ثبت‌نام ---
function showRegister() {
  document.getElementById('register-form').style.display = 'block';
  document.getElementById('login-page').style.display = 'none';
}

function showLogin() {
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-page').style.display = 'block';
}

function register() {
  const user = document.getElementById('reg-username').value.trim();
  const pass = document.getElementById('reg-password').value.trim();
  if (!user || !pass) return alert('⚠️ نام و رمز را وارد کنید');
  localStorage.setItem(`user_${user}`, pass);
  alert('✅ ثبت‌نام موفقیت‌آمیز بود');
  showLogin();
}

function login() {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  const savedPass = localStorage.getItem(`user_${user}`);

  if (user === 'admin' && pass === 'admin@123') {
    loginAs(user, 'ادمین');
  } else if (savedPass && savedPass === pass) {
    loginAs(user, 'کاربر');
  } else {
    alert('❌ نام یا رمز اشتباه است');
  }
}

function loginAs(name, role) {
  userName = name;
  userRole = role;
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('chat-page').style.display = 'block';

  // اتصال به سرور
  socket = io();
  socket.emit('join', { name: userName, role: userRole });

  socket.on('rooms-list', (rooms) => {
    const list = document.getElementById('rooms-list');
    list.innerHTML = '';
    rooms.forEach(room => {
      const li = document.createElement('li');
      li.textContent = room;
      list.appendChild(li);
    });
  });

  socket.on('users-list', (users) => {
    const list = document.getElementById('users-list');
    list.innerHTML = '';
    users.forEach(u => {
      const li = document.createElement('li');
      li.textContent = u.name;
      if (u.role !== 'کاربر') li.style.fontWeight = 'bold';
      list.appendChild(li);
    });
  });

  socket.on('message-received', (data) => {
    const p = document.createElement('p');
    p.innerHTML = `<b>${data.sender}:</b> ${data.text}`;
    document.getElementById('chat-messages').appendChild(p);
    document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
  });
}

// --- چت ---
function sendMessage() {
  const input = document.getElementById('message-box');
  const message = input.value;
  if (message.trim()) {
    socket.emit('send-message', {
      sender: userName,
      text: message,
      room: 'عمومی'
    });
    input.value = '';
  }
}

function showGIFs() {
  document.getElementById('gif-modal').style.display = 'block';
}

function closeGIFs() {
  document.getElementById('gif-modal').style.display = 'none';
}

function sendGIF(src) {
  socket.emit('send-message', {
    sender: userName,
    text: `<img src="${src}" style="width:100px;">`,
    room: 'عمومی'
  });
  closeGIFs();
}

// --- خروج ---
function logout() {
  if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
    socket.disconnect();
    document.getElementById('chat-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
  }
}
