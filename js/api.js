// js/api.js
const API_BASE_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

export async function getMovies(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_BASE_URL}/movies?${queryParams}`);
  return await response.json();
}

export async function getMovieById(id) {
  const response = await fetch(`${API_BASE_URL}/movies/${id}`);
  return await response.json();
}

export async function searchMovies(query) {
  const response = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}`);
  return await response.json();
}

export async function getMovieComments(movieId) {
  const response = await fetch(`${API_BASE_URL}/comments/movie/${movieId}`);
  return await response.json();
}

export async function addComment(movieId, text) {
  const response = await fetch(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ movieId, text })
  });
  return await response.json();
}

export async function updateComment(commentId, text) {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ text })
  });
  return await response.json();
}

export async function deleteComment(commentId) {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return await response.json();
}

export async function addToFavorites(movieId) {
  const response = await fetch(`${API_BASE_URL}/users/favorites`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ movieId })
  });
  return await response.json();
}

export async function removeFromFavorites(movieId) {
  const response = await fetch(`${API_BASE_URL}/users/favorites/${movieId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return await response.json();
}

export async function getFavorites() {
  const response = await fetch(`${API_BASE_URL}/users/favorites`, {
    headers: getAuthHeaders()
  });
  return await response.json();
}

export async function addRating(movieId, rating) {
  const response = await fetch(`${API_BASE_URL}/ratings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ movieId, rating })
  });
  return await response.json();
}

export default {
  getMovies,
  getMovieById,
  searchMovies,
  getMovieComments,
  addComment,
  updateComment,
  deleteComment,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  addRating
};
