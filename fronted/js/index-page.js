
import { getMovies } from './api.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderTrendingMovies(movies) {
  const track = document.getElementById('movies-track');
  if (!track) return;

  if (!movies || movies.length === 0) {
    track.innerHTML = `<div class="text-center text-muted py-4 w-100">No movies yet</div>`;
    return;
  }

  const selected = shuffle(movies).slice(0, 10);

  track.innerHTML = selected.map(m => `
    <article class="movie-card">
      <a href="movie-details.html?id=${encodeURIComponent(m._id)}">
        <img src="${m.posterUrl || 'images/placeholder.jpg'}" alt="${m.title || 'Movie'}">
      </a>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const movies = await getMovies({ limit: 100, sort: '-createdAt' });
    renderTrendingMovies(movies);

  } catch (e) {
    console.error('Failed to load trending movies:', e);
    renderTrendingMovies([]);
  }
});
