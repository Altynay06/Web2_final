import * as api from './api.js';
import { getUser, isLoggedIn } from './session.js';

let currentMovieId = null;
let currentUser = null;

function getMovieIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function toEmbedUrl(url) {
  if (!url) return '';
  if (url.includes('/embed/')) return url;

  let videoId = '';

  const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtuBeMatch) {
    videoId = youtuBeMatch[1].split('?')[0];
  }

  const youtubeMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    videoId = youtubeMatch[1];
  }

  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch) {
    videoId = embedMatch[1];
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
}

function safeSetHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;

  if (type === 'error') toast.style.borderLeftColor = '#ff4444';
  if (type === 'info') toast.style.borderLeftColor = '#17a2b8';

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

async function loadMovieDetails() {
  const movieId = getMovieIdFromUrl();

  if (!movieId) {
    safeSetHTML('movie-details', '<p class="text-danger">Movie ID not specified</p>');
    return;
  }

  currentMovieId = movieId;
  currentUser = getUser();

  try {
    const movie = await api.getMovieById(movieId);
    renderMovieDetails(movie);

    await loadComments(movieId);
    await loadSimilarMovies(movie?.genre?.[0] || '');

    setupEventHandlers();
  } catch (error) {
    console.error('Error loading movie:', error);
    safeSetHTML('movie-details', `<p class="text-danger">Error loading movie: ${error.message}</p>`);
  }
}

function renderMovieDetails(movie) {
  const poster = movie.posterUrl || 'images/no-poster.png';

  const backdrop = document.getElementById('backdrop');
  if (backdrop) backdrop.style.backgroundImage = `url('${poster}')`;

  // ========== КРАСИВЫЙ БЛОК ТРЕЙЛЕРА С АНИМАЦИЕЙ ==========
  const trailerContainer = document.querySelector('.trailer-container');
  if (trailerContainer) {
    if (movie.title && movie.title.includes('Shawshank')) {
      trailerContainer.innerHTML = `
        <div class="trailer-wrapper" style="
          background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,70,70,0.3);
          transition: all 0.3s ease;
        ">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
            <div style="
              background: #ff4444;
              width: 50px;
              height: 50px;
              border-radius: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              transform: rotate(0deg);
              transition: transform 0.3s ease;
            " class="trailer-icon">
              <i class="fas fa-film" style="font-size: 24px; color: white;"></i>
            </div>
            <div>
              <h3 style="
                color: #ff4444;
                margin: 0;
                font-size: 28px;
                font-weight: 700;
                text-shadow: 0 0 10px rgba(255,68,68,0.3);
              ">
                <i class="fas fa-play-circle" style="margin-right: 10px;"></i>
                Official Trailer
              </h3>
              <p style="
                color: #aaa;
                margin: 5px 0 0 0;
                font-size: 14px;
                letter-spacing: 1px;
              ">
                Warner Bros. Entertainment • 4K
              </p>
            </div>
          </div>
          
          <a href="https://youtu.be/PLl99DlL6b4" 
             target="_blank" 
             class="youtube-button"
             style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 15px;
              background: linear-gradient(45deg, #ff4444, #ff1a1a);
              color: white;
              text-decoration: none;
              padding: 18px 25px;
              border-radius: 50px;
              font-size: 18px;
              font-weight: 600;
              letter-spacing: 1px;
              border: none;
              box-shadow: 0 5px 20px rgba(255,68,68,0.4);
              transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              position: relative;
              overflow: hidden;
             "
             onmouseover="this.style.transform='scale(1.02)';this.style.boxShadow='0 10px 30px rgba(255,68,68,0.6)';"
             onmouseout="this.style.transform='scale(1)';this.style.boxShadow='0 5px 20px rgba(255,68,68,0.4)';">
            
            <span style="
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(255,255,255,0.2);
              width: 40px;
              height: 40px;
              border-radius: 50%;
            ">
              <i class="fab fa-youtube" style="font-size: 24px;"></i>
            </span>
            
            <span style="flex: 1; text-align: center;">
              WATCH NOW IN 4K
              <span style="
                display: block;
                font-size: 12px;
                opacity: 0.9;
                margin-top: 3px;
              ">
                The Shawshank Redemption • Official Trailer
              </span>
            </span>
            
            <span style="
              display: flex;
              align-items: center;
              gap: 5px;
              background: rgba(0,0,0,0.2);
              padding: 8px 15px;
              border-radius: 30px;
              font-size: 14px;
            ">
              <i class="fas fa-external-link-alt"></i>
              YouTube
            </span>
            
            <div style="
              position: absolute;
              top: -50%;
              left: -60%;
              width: 200%;
              height: 200%;
              background: linear-gradient(
                to right,
                rgba(255,255,255,0) 0%,
                rgba(255,255,255,0.3) 50%,
                rgba(255,255,255,0) 100%
              );
              transform: rotate(45deg);
              animation: shine 3s infinite;
              pointer-events: none;
            "></div>
          </a>
          
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            color: #888;
            font-size: 13px;
            padding: 0 10px;
          ">
            <span>
              <i class="fas fa-calendar" style="margin-right: 5px; color: #ff4444;"></i>
              Jul 27, 2021
            </span>
            <span>
              <i class="fas fa-eye" style="margin-right: 5px; color: #ff4444;"></i>
              2.3M views
            </span>
            <span>
              <i class="fas fa-star" style="margin-right: 5px; color: #ff4444;"></i>
              Official
            </span>
          </div>
        </div>
        
        <style>
          @keyframes shine {
            0% { left: -60%; }
            20% { left: 100%; }
            100% { left: 100%; }
          }
          .trailer-wrapper:hover .trailer-icon {
            transform: rotate(10deg) scale(1.1);
          }
        </style>
      `;
      trailerContainer.style.display = 'block';
    } 
    else if (movie.trailerUrl) {
      trailerContainer.innerHTML = `
        <div style="
          background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255,68,68,0.2);
          transition: all 0.3s ease;
        ">
          <h3 style="
            color: #ff4444;
            margin-bottom: 15px;
            font-size: 24px;
            display: flex;
            align-items: center;
            gap: 10px;
          ">
            <i class="fas fa-play" style="
              background: #ff4444;
              color: white;
              padding: 8px;
              border-radius: 50%;
              font-size: 14px;
            "></i>
            Trailer
          </h3>
          
          <a href="${movie.trailerUrl}" 
             target="_blank"
             style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: linear-gradient(45deg, #ff4444, #cc0000);
              color: white;
              text-decoration: none;
              padding: 15px 20px;
              border-radius: 12px;
              transition: all 0.3s ease;
             "
             onmouseover="this.style.transform='translateX(5px)';this.style.boxShadow='0 5px 20px rgba(255,68,68,0.4)';"
             onmouseout="this.style.transform='translateX(0)';this.style.boxShadow='none';">
            
            <span style="display: flex; align-items: center; gap: 12px;">
              <i class="fab fa-youtube" style="font-size: 28px;"></i>
              <span>
                <strong style="font-size: 16px;">Watch on YouTube</strong>
                <br>
                <small style="opacity: 0.9;">${movie.title || 'Movie'} • Official Trailer</small>
              </span>
            </span>
            
            <i class="fas fa-arrow-right" style="font-size: 20px;"></i>
          </a>
        </div>
      `;
      trailerContainer.style.display = 'block';
    } else {
      trailerContainer.style.display = 'none';
    }
  }
  // ========== КОНЕЦ КРАСИВОГО БЛОКА ТРЕЙЛЕРА ==========

  safeSetHTML(
    'movie-details',
    `
    <div class="row">
      <div class="col-md-4 mb-3">
        <img src="${poster}" alt="${movie.title || 'Movie'}" class="movie-poster shadow-lg">
      </div>

      <div class="col-md-8">
        <h1 class="text-danger">
          ${movie.title || ''}
          ${movie.year ? `<span class="text-white">(${movie.year})</span>` : ''}
        </h1>

        <p><strong>Genre:</strong> ${(movie.genre || []).join(', ')}</p>
        <p><strong>Average rating:</strong> ${Number(movie.rating || 0).toFixed(1)} / 5</p>

        <div class="mt-4">
          <h5 class="info-title">Description</h5>
          <p>${movie.description || ''}</p>
        </div>

        <div class="mt-4">
          <button class="btn btn-outline-danger favorite-btn" id="favoriteBtn">
            <i class="far fa-heart"></i> Add to Favorites
          </button>
        </div>

        <div class="mt-4 user-rating">
          <div class="user-rating-label">Your Rating:</div>
          <div class="rating-stars" id="ratingStars">
            ${[1, 2, 3, 4, 5]
              .map((i) => `<i class="far fa-star star" data-rating="${i}"></i>`)
              .join('')}
          </div>
          <div class="user-rating-message" id="ratingMessage">Click to rate</div>
        </div>
      </div>
    </div>
  `
  );
}

async function loadComments(movieId) {
  try {
    const comments = await api.getMovieComments(movieId);
    renderComments(comments);
  } catch (error) {
    console.error('Error loading comments:', error);
    safeSetHTML('commentsList', '<p class="text-muted">Failed to load comments</p>');
  }
}

function renderComments(comments) {
  const list = document.getElementById('commentsList');
  if (!list) return;

  if (!comments || comments.length === 0) {
    list.innerHTML = '<p class="text-muted">No comments yet. Be the first to comment!</p>';
    return;
  }

  const myId = String(currentUser?.id || currentUser?._id || '');

  list.innerHTML = comments
    .map((c) => {
      const authorId = String(c.userId || '');
      const canEdit = myId && authorId && myId === authorId;

      return `
        <div class="comment-item" data-comment-id="${c._id}">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <strong class="text-danger">${c.userName || 'User'}</strong>
              <small class="text-muted ms-2">${new Date(c.createdAt).toLocaleDateString()}</small>
              ${c.edited ? '<small class="text-warning ms-2">(edited)</small>' : ''}
            </div>

            ${
              canEdit
                ? `
              <div class="comment-actions">
                <button class="btn btn-sm btn-outline-warning edit-comment-btn" data-id="${c._id}">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-comment-btn" data-id="${c._id}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            `
                : ''
            }
          </div>
          <p class="mt-2 mb-0 comment-text">${c.text || ''}</p>
        </div>
      `;
    })
    .join('');

  document.querySelectorAll('.delete-comment-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (!confirm('Delete this comment?')) return;
      try {
        await api.deleteComment(id);
        await loadComments(currentMovieId);
        showToast('Comment deleted!');
      } catch (e) {
        showToast(e?.message || 'Error deleting comment', 'error');
      }
    });
  });
  document.querySelectorAll('.edit-comment-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const item = btn.closest('.comment-item');
      const oldText = item?.querySelector('.comment-text')?.textContent || '';
      const newText = prompt('Edit your comment:', oldText);
      if (newText === null) return;

      const trimmed = newText.trim();
      if (!trimmed) return showToast('Comment cannot be empty', 'error');

      try {
        await api.updateComment(id, trimmed);
        await loadComments(currentMovieId);
        showToast('Comment updated!');
      } catch (e) {
        showToast(e?.message || 'Error updating comment', 'error');
      }
    });
  });
}

async function loadSimilarMovies(genre) {
  const box = document.getElementById('similarMovies');
  if (!box) return;

  if (!genre) {
    box.innerHTML = '<p class="text-muted">No similar movies</p>';
    return;
  }

  try {
    const movies = await api.getMovies({ genre, limit: 6, sort: '-createdAt' });
    const filtered = (movies || []).filter((m) => String(m._id) !== String(currentMovieId)).slice(0, 4);
    renderSimilarMovies(filtered);
  } catch (error) {
    console.error('Error loading similar movies:', error);
    box.innerHTML = '<p class="text-muted">Failed to load similar movies</p>';
  }
}

function renderSimilarMovies(movies) {
  const box = document.getElementById('similarMovies');
  if (!box) return;

  if (!movies || movies.length === 0) {
    box.innerHTML = '<p class="text-muted">No similar movies found</p>';
    return;
  }

  box.innerHTML = movies
    .map((m) => {
      const poster = m.posterUrl || 'images/no-poster.png';
      return `
        <a href="movie-details.html?id=${encodeURIComponent(m._id)}" class="d-block text-decoration-none mb-2">
          <div class="bg-black p-2 rounded d-flex align-items-center">
            <img src="${poster}" alt="${m.title || 'Movie'}"
                 style="width:60px;height:90px;object-fit:cover;border-radius:6px;">
            <div class="ms-3">
              <strong class="text-white d-block">${m.title || ''}</strong>
              <small class="text-muted">${m.year || ''} • ${(m.genre && m.genre[0]) || ''}</small>
            </div>
          </div>
        </a>
      `;
    })
    .join('');
}

function paintStars(value) {
  const stars = document.querySelectorAll('#ratingStars .star');
  stars.forEach((s, idx) => {
    const active = idx < value;
    s.classList.toggle('fas', active);
    s.classList.toggle('selected', active);
    s.classList.toggle('far', !active);
  });
}

function setupEventHandlers() {
  const submitBtn = document.getElementById('submitComment');
  submitBtn?.addEventListener('click', async () => {
    const textarea = document.getElementById('commentText');
    const text = textarea?.value?.trim() || '';

    if (!text) return showToast('Please enter a comment', 'error');
    if (!isLoggedIn()) return showToast('Please login to comment', 'error');

    try {
      await api.addComment(currentMovieId, text);
      if (textarea) textarea.value = '';
      await loadComments(currentMovieId);
      showToast('Comment added!');
    } catch (e) {
      showToast(e?.message || 'Error adding comment', 'error');
    }
  });

  document.querySelectorAll('#ratingStars .star').forEach((star) => {
    star.addEventListener('click', async () => {
      const rating = parseInt(star.dataset.rating, 10);
      if (!isLoggedIn()) return showToast('Please login to rate', 'error');

      try {
        const result = await api.addRating(currentMovieId, rating);
        paintStars(rating);

        const msg = document.getElementById('ratingMessage');
        if (msg) {
          msg.textContent = `You rated ${rating} stars. Average: ${Number(result.averageRating || 0).toFixed(1)}`;
        }

        showToast('Rating submitted!');
      } catch (e) {
        showToast(e?.message || 'Error submitting rating', 'error');
      }
    });
  });

  const favBtn = document.getElementById('favoriteBtn');
  favBtn?.addEventListener('click', async () => {
    if (!isLoggedIn()) return showToast('Please login to add favorites', 'error');

    try {
      await api.addToFavorites(currentMovieId);
      favBtn.innerHTML = '<i class="fas fa-heart"></i> Added to Favorites';
      showToast('Added to favorites!');
    } catch (e) {
      showToast(e?.message || 'Error adding to favorites', 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', loadMovieDetails);