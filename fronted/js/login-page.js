import { loginUser } from './api.js';
import { saveSession } from './session.js';

const form = document.getElementById('loginForm');
const msg = document.getElementById('msg');

function show(text, type = 'danger') {
  msg.className = `mt-3 text-center text-${type}`;
  msg.textContent = text;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  show('');

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    show('Please fill all fields');
    return;
  }

  try {
    const data = await loginUser(email, password);

    if (data?.error) {
      show(data.error);
      return;
    }

    if (!data?.token || !data?.user) {
      show('Login failed: invalid server response');
      return;
    }

    saveSession(data.token, data.user);

    show(' Logged in!', 'success');
    setTimeout(() => (window.location.href = 'index.html'), 500);
  } catch (err) {
    show(err?.message || 'Login failed');
    console.error(err);
  }
});
