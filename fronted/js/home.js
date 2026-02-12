
import * as api from './api.js';

const MAX_ON_HOME = 10;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function loadHomeMovies() {
  try {
    const movies = await api.getMovies({ limit: 100, sort: '-createdAt' });

    if (!movies || movies.length === 0) {
      const sec = document.getElementById('api-movies-section');
      if (sec) sec.style.display = 'none';
      return;
    }

    const randomPick =
      movies.length <= MAX_ON_HOME
        ? movies
        : shuffleArray(movies).slice(0, MAX_ON_HOME);

    renderHomeMovies(randomPick);
  } catch (err) {
    console.error('Error loading home movies:', err);
    const sec = document.getElementById('api-movies-section');
    if (sec) sec.style.display = 'none';
  }
}

function renderHomeMovies(movies) {
  const container = document.getElementById('trending-movies');
  if (!container) return;

  container.innerHTML = movies.map(movie => `
    <div class="col-md-6 col-lg-4 col-xl-3">
      <div class="media-card">
        <div class="media-card-image">
          <a href="movie-details.html?id=${encodeURIComponent(movie._id)}">
            <img
              src="${movie.posterUrl || 'images/placeholder.jpg'}"
              alt="${movie.title || 'Movie'}"
              class="media-img"
              loading="lazy"
            >
          </a>
        </div>
        <div class="media-card-content">
          <h3 class="media-title">${movie.title || ''} ${movie.year ? `(${movie.year})` : ''}</h3>
          <p class="media-genre"><strong>Genre:</strong> ${(movie.genre || []).join(', ')}</p>
          <p class="media-rating"><strong>Rating:</strong> ${movie.rating ?? 0}/5</p>
          <p class="media-plot">${(movie.description || '').substring(0, 80)}...</p>
          <div class="media-card-actions">
            <a href="movie-details.html?id=${encodeURIComponent(movie._id)}" class="btn btn-danger">
              <i class="fas fa-info-circle"></i> Details
            </a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadHomeMovies();
});
