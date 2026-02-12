import { registerUser } from './api.js';
import { saveSession } from './session.js';

const form = document.getElementById('registerForm');
const msg = document.getElementById('msg');

function show(text, type = 'danger') {
  msg.className = `mt-3 text-center text-${type}`;
  msg.textContent = text;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  show('');

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !email || !password) {
    show('Please fill all fields');
    return;
  }

  try {
    const data = await registerUser(username, email, password);

    if (data?.error) {
      show(data.error);
      return;
    }

    if (!data?.token || !data?.user) {
      show('Registration failed: invalid server response');
      return;
    }

    saveSession(data.token, data.user);

    show('✅ Registered & logged in!', 'success');
    setTimeout(() => (window.location.href = 'index.html'), 500);
  } catch (err) {
    show(err?.message || 'Registration failed');
    console.error(err);
  }
});
