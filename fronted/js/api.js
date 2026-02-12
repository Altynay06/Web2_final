const API_BASE_URL = '/api';


function getToken() {
  return localStorage.getItem('token');
}

function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function registerUser(username, email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function getMovies(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE_URL}/movies?${queryParams}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load movies');
  return data.movies || [];
}

export async function getMovieById(id) {
  const res = await fetch(`${API_BASE_URL}/movies/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load movie');
  return data.movie;
}

export async function getMovieComments(movieId) {
  const res = await fetch(`${API_BASE_URL}/comments/movie/${movieId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load comments');
  return data.comments || [];
}


export async function addComment(movieId, text) {
  const res = await fetch(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ movieId, text })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add comment');
  return data;
}

export async function updateComment(commentId, text) {
  const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update comment');
  return data;
}

export async function deleteComment(commentId) {
  const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete comment');
  return data;
}

export async function addToFavorites(movieId) {
  const res = await fetch(`${API_BASE_URL}/users/favorites`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ movieId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add favorite');
  return data;
}

export async function removeFromFavorites(movieId) {
  const res = await fetch(`${API_BASE_URL}/users/favorites/${movieId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to remove favorite');
  return data;
}

export async function getFavorites() {
  const res = await fetch(`${API_BASE_URL}/users/favorites`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load favorites');

  return Array.isArray(data) ? data : (data.favorites || []);
}

export async function addRating(movieId, rating) {
  const res = await fetch(`${API_BASE_URL}/ratings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ movieId, rating })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to rate movie');
  return data;
}

// ---------- ADMIN MOVIES ----------
export async function createMovie(movieData) {
  const res = await fetch(`${API_BASE_URL}/movies`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(movieData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create movie');
  return data.movie;
}

export async function deleteMovie(id) {
  const res = await fetch(`${API_BASE_URL}/movies/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete movie');
  return data;
}
export async function updateMovie(id, movieData) {
  const res = await fetch(`${API_BASE_URL}/movies/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(movieData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update movie');
  return data.movie;
}
