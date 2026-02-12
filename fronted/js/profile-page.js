import { getUser, isLoggedIn, logout } from './session.js';

document.addEventListener('DOMContentLoaded', () => {

  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  const user = getUser();

  document.getElementById('username').textContent = user?.username || '';
  document.getElementById('email').textContent = user?.email || '';
  document.getElementById('role').textContent = user?.role || 'user';

  document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
    window.location.href = 'index.html';
  });

});
