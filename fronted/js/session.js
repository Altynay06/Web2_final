
export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  const raw = localStorage.getItem('user');
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getToken() && !!getUser();
}

export function saveSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function updateHeaderAuthUI() {
  const loginBtn = document.getElementById('loginBtn');   
  const profileBtn = document.getElementById('profileBtn'); 

  if (!loginBtn || !profileBtn) return;

  if (isLoggedIn()) {
    loginBtn.style.display = 'none';
    profileBtn.style.display = 'inline-block';
  } else {
    loginBtn.style.display = 'inline-block';
    profileBtn.style.display = 'none';
  }
}
