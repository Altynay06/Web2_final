import * as api from './api.js';

const API_BASE_URL = 'http://localhost:5000/api';
let currentMovieId = null;
let currentUser = null;

function getMovieIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadMovieDetails() {
  const movieId = getMovieIdFromUrl();
  if (!movieId) {
    document.getElementById('movie-details').innerHTML = '<p class="text-danger">Movie ID not specified</p>';
    return;
  }
  currentMovieId = movieId;
  try {
    const movie = await api.getMovieById(movieId);
    if (movie.error) throw new Error(movie.error);
    renderMovieDetails(movie);
    loadComments(movieId);
    loadSimilarMovies(movie.genre && movie.genre[0]);

    const userData = localStorage.getItem('user');
    if (userData) currentUser = JSON.parse(userData);
  } catch (error) {
    console.error('Error loading movie:', error);
    document.getElementById('movie-details').innerHTML = `<p class="text-danger">Error loading movie: ${error.message}</p>`;
  }
}

function renderMovieDetails(movie) {
  const backdrop = document.getElementById('backdrop');
  if (backdrop) backdrop.style.backgroundImage = `url('${movie.posterUrl}')`;
  const actors = (movie.actors || []).map(actor => `<span>${actor}</span>`).join('');
  document.getElementById('movie-details').innerHTML = `
    <img src="${movie.posterUrl}" alt="${movie.title}" class="movie-poster shadow-lg">
    <div class="movie-meta">
      <h2 class="text-danger mb-3">${movie.title} (${movie.year})</h2>
      <p><strong>🎭 Genre:</strong> ${movie.genre ? movie.genre.join(', ') : ''}</p>
      <p><strong>⭐ Rating:</strong> ${movie.rating ? movie.rating.toFixed(1) : 'N/A'}</p>
      <p><strong>🎬 Director:</strong> ${movie.director}</p>
      <p><strong>⏱️ Duration:</strong> ${movie.duration || 'N/A'}</p>
      <div class="mt-3">
        <h5 class="info-title">Cast</h5>
        <div class="cast-list">${actors}</div>
      </div>
      <div class="mt-4">
        <h5 class="info-title">Plot</h5>
        <p>${movie.description}</p>
      </div>
      <div class="mt-4">
        <p><strong>Country:</strong> ${movie.country || 'N/A'}</p>
        <p><strong>Language:</strong> ${movie.language || 'N/A'}</p>
      </div>
      <div class="mt-4">
        <button class="btn btn-danger trailer-btn" data-trailer="${movie.trailerUrl}">
          <i class="fas fa-play"></i> Watch Trailer
        </button>
        <button class="btn btn-outline-danger favorite-btn" id="favoriteBtn">
          <i class="far fa-heart"></i> Add to Favorites
        </button>
      </div>
      <div class="mt-4 user-rating">
        <div class="user-rating-label">Your Rating:</div>
        <div class="rating-stars" id="ratingStars">
          ${[1,2,3,4,5].map(i => `
            <i class="far fa-star star" data-rating="${i}"></i>
          `).join('')}
        </div>
        <div class="user-rating-message" id="ratingMessage">Click to rate</div>
      </div>
    </div>
  `;
  setupEventHandlers();
}

async function loadComments(movieId) {
  try {
    const comments = await api.getMovieComments(movieId);
    renderComments(comments);
  } catch (error) {
    console.error('Error loading comments:', error);
  }
}

function renderComments(comments) {
  const commentsList = document.getElementById('commentsList');
  if (!comments || comments.length === 0) {
    commentsList.innerHTML = '<p class="text-muted">No comments yet. Be the first to comment!</p>';
    return;
  }
  commentsList.innerHTML = comments.map(comment => `
    <div class="comment-item mb-3 p-3 bg-dark rounded" data-comment-id="${comment._id}">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <strong class="text-danger">${comment.userName}</strong>
          <small class="text-muted ms-2">${new Date(comment.createdAt).toLocaleDateString()}</small>
          ${comment.edited ? '<small class="text-warning ms-2">(edited)</small>' : ''}
        </div>
        ${currentUser && currentUser._id === comment.userId ? `
          <div class="comment-actions">
            <button class="btn btn-sm btn-outline-warning edit-comment-btn" data-id="${comment._id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger delete-comment-btn" data-id="${comment._id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        ` : ''}
      </div>
      <p class="mt-2 mb-0 comment-text">${comment.text}</p>
    </div>
  `).join('');

  document.querySelectorAll('.edit-comment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const commentId = e.target.closest('button').dataset.id;
      const commentText = e.target.closest('.comment-item').querySelector('.comment-text').textContent;
      openEditModal(commentId, commentText);
    });
  });

  document.querySelectorAll('.delete-comment-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const commentId = e.target.closest('button').dataset.id;
      if (confirm('Are you sure you want to delete this comment?')) {
        try {
          await api.deleteComment(commentId);
          loadComments(currentMovieId);
          showToast('Comment deleted successfully!');
        } catch (error) {
          showToast('Error deleting comment', 'error');
        }
      }
    });
  });
}

async function loadSimilarMovies(genre) {
  try {
    const response = await fetch(`${API_BASE_URL}/movies?genre=${genre}&limit=4`);
    const movies = await response.json();
    renderSimilarMovies(movies);
  } catch (error) {
    console.error('Error loading similar movies:', error);
  }
}

function renderSimilarMovies(movies) {
  const similarMovies = document.getElementById('similarMovies');
  similarMovies.innerHTML = (movies || []).map(movie => `
    <a href="movie-details.html?id=${movie._id}" class="similar-movie mb-3 d-block text-decoration-none">
      <div class="d-flex align-items-center bg-dark p-2 rounded">
        <img src="${movie.posterUrl}" alt="${movie.title}" style="width: 60px; height: 90px; object-fit: cover; border-radius: 5px;">
        <div class="ms-3">
          <h6 class="mb-0 text-white">${movie.title}</h6>
          <small class="text-muted">${movie.year} • ${movie.genre ? movie.genre[0] : ''}</small>
        </div>
      </div>
    </a>
  `).join('');
}

function setupEventHandlers() {
  document.getElementById('submitComment')?.addEventListener('click', async () => {
    const textarea = document.getElementById('commentText');
    const text = textarea.value.trim();
    if (!text) { showToast('Please enter a comment', 'error'); return; }
    if (!currentUser) { showToast('Please login to comment', 'error'); return; }
    try { await api.addComment(currentMovieId, text); textarea.value = ''; loadComments(currentMovieId); showToast('Comment added successfully!'); }
    catch (error) { showToast('Error adding comment', 'error'); }
  });

  document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', async (e) => {
      const rating = parseInt(e.target.dataset.rating);
      if (!currentUser) { showToast('Please login to rate movies', 'error'); return; }
      try {
        await api.addRating(currentMovieId, rating);
        document.querySelectorAll('.star').forEach((s, i) => {
          if (i < rating) { s.classList.remove('far'); s.classList.add('fas', 'selected'); }
          else { s.classList.remove('fas', 'selected'); s.classList.add('far'); }
        });
        document.getElementById('ratingMessage').textContent = `You rated ${rating} stars`;
        document.getElementById('ratingMessage').classList.add('text-success');
        showToast('Rating submitted!');
      } catch (error) { showToast('Error submitting rating', 'error'); }
    });
  });

  document.getElementById('favoriteBtn')?.addEventListener('click', async () => {
    if (!currentUser) { showToast('Please login to add to favorites', 'error'); return; }
    const btn = document.getElementById('favoriteBtn');
    try { await api.addToFavorites(currentMovieId); btn.innerHTML = '<i class="fas fa-heart"></i> Added to Favorites'; btn.classList.add('added'); showToast('Added to favorites!'); }
    catch (error) { showToast('Error adding to favorites', 'error'); }
  });

  document.querySelector('.trailer-btn')?.addEventListener('click', (e) => {
    const trailerUrl = e.target.closest('button').dataset.trailer;
    openTrailer(trailerUrl);
  });
}

let editingCommentId = null;
function openEditModal(commentId, text) {
  editingCommentId = commentId;
  document.getElementById('editCommentText').value = text;
  document.getElementById('editCommentModal').style.display = 'flex';
}

document.getElementById('closeEditModal')?.addEventListener('click', () => { document.getElementById('editCommentModal').style.display = 'none'; });
document.getElementById('cancelEditComment')?.addEventListener('click', () => { document.getElementById('editCommentModal').style.display = 'none'; });

document.getElementById('saveEditComment')?.addEventListener('click', async () => {
  const text = document.getElementById('editCommentText').value.trim();
  if (!text) { showToast('Comment cannot be empty', 'error'); return; }
  try { await api.updateComment(editingCommentId, text); document.getElementById('editCommentModal').style.display = 'none'; loadComments(currentMovieId); showToast('Comment updated successfully!'); }
  catch (error) { showToast('Error updating comment', 'error'); }
});

function openTrailer(url) {
  const modal = document.createElement('div');
  modal.className = 'trailer-modal';
  modal.innerHTML = `
    <div class="modal-container">
      <button class="close-trailer-btn">&times;</button>
      <div class="video-container">
        <iframe src="${url}" frameborder="0" allowfullscreen></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'flex';
  modal.querySelector('.close-trailer-btn').addEventListener('click', () => { modal.remove(); });
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  if (type === 'error') toast.style.borderLeftColor = '#ff4444';
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  loadMovieDetails();
  const userData = localStorage.getItem('user'); if (userData) currentUser = JSON.parse(userData);
});

    const API_KEY = "6d9225fc";
    const params = new URLSearchParams(window.location.search);
    const movieTitle = params.get("title");

    async function fetchMovieDetails() {
      const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(movieTitle)}&plot=full`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.Response === "True") {
        document.getElementById("backdrop").style.backgroundImage = `url('${data.Poster}')`;

        const actors = data.Actors.split(", ").map(actor => `<span>${actor}</span>`).join("");

        document.getElementById("movie-details").innerHTML = `
          <img src="${data.Poster}" alt="${data.Title}" class="movie-poster shadow-lg">
          <div class="movie-meta">
            <h2 class="text-danger mb-3">${data.Title} (${data.Year})</h2>
            <p><strong>🎭 Genre:</strong> ${data.Genre}</p>
            <p><strong>⭐ IMDb Rating:</strong> ${data.imdbRating}</p>
            <p><strong>🎬 Director:</strong> ${data.Director}</p>
            <p><strong>🖊️ Writer:</strong> ${data.Writer}</p>
            <div class="mt-3">
              <h5 class="info-title">Main Cast</h5>
              <div class="cast-list">${actors}</div>
            </div>
            <div class="mt-4">
              <h5 class="info-title">Plot</h5>
              <p>${data.Plot}</p>
            </div>
            <div class="mt-4">
              <h5 class="info-title">Country</h5>
              <p>${data.Country}</p>
              <h5 class="info-title mt-3">Language</h5>
              <p>${data.Language}</p>
              <h5 class="info-title mt-3">Awards</h5>
              <p>${data.Awards}</p>
            </div>
          </div>
        `;
      } else {
        document.getElementById("movie-details").innerHTML = `<p class="text-danger">Movie not found 😢</p>`;
      }
    }

    fetchMovieDetails();

  