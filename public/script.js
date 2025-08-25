// --- مدیریت ورود ---
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
    loginAs('ادمین', user);
  } else if (savedPass && savedPass === pass) {
    loginAs('کاربر', user);
  } else {
    alert('❌ نام یا رمز اشتباه است');
  }
}

function loginAs(role, user) {
  window.userName = user;
  window.userRole = role;
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('chat-page').style.display = 'block';
  document.getElementById('chat-messages').innerHTML += `<p><b>سیستم:</b> خوش آمدید!</p>`;
}

// --- چت متنی ---
function sendMessage() {
  const input = document.getElementById('message-box');
  const message = input.value;
  if (message.trim()) {
    const p = document.createElement('p');
    p.innerHTML = `<b>${userName}:</b> ${message}`;
    document.getElementById('chat-messages').appendChild(p);
    document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
    input.value = '';
  }
}

// --- خروج از چت ---
function logout() {
  if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
    document.getElementById('chat-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
  }
}

// --- پروفایل ---
function openProfile(user) {
  alert(`👤 پروفایل ${user}`);
}

// --- تماس صوتی/تصویری (شبیه‌سازی) ---
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
myVideo.srcObject = null;

// در نسخه واقعی با WebRTC پیاده‌سازی میشه
