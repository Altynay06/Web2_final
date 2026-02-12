import { getMovies, createMovie, deleteMovie } from './api.js';
import { getUser, isLoggedIn } from './session.js';

function extractYouTubeId(input) {
  if (!input) return '';

  // если уже ID
  if (!input.includes('http') && !input.includes('youtu')) return input.trim();

  // https://youtu.be/VIDEO_ID
  const short = input.match(/youtu\.be\/([^?]+)/);
  if (short?.[1]) return short[1];

  // https://www.youtube.com/watch?v=VIDEO_ID
  const watch = input.match(/[?&]v=([^&]+)/);
  if (watch?.[1]) return watch[1];

  // https://www.youtube.com/embed/VIDEO_ID
  const embed = input.match(/youtube\.com\/embed\/([^?]+)/);
  if (embed?.[1]) return embed[1];

  return '';
}


function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  if (type === 'error') toast.style.borderLeftColor = '#ff4444';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function renderMovies(movies) {
  const list = document.getElementById('media-list');
  if (!list) return;

  if (!movies.length) {
    list.innerHTML = `<div class="col-12 text-center text-muted py-5">No movies yet</div>`;
    return;
  }

  const user = getUser();
  const isAdmin = user?.role === 'admin';

  list.innerHTML = movies.map(m => `
    <div class="col-6 col-md-4 col-lg-3 col-xl-2">
      <article class="movie-card-grid media-card"
        data-genres="${(m.genre || []).join(',')}"
        data-year="${m.year || ''}"
        data-rating="${m.rating || 0}">
        
        <img src="${m.posterUrl || 'images/placeholder.jpg'}"
             alt="${m.title || 'Movie'}"
             style="cursor:pointer"
             data-id="${m._id}">
        
        <h3 class="movie-card-title media-title">${m.title || ''}</h3>

        ${isAdmin ? `
          <div class="p-2">
            <button class="btn btn-sm btn-outline-danger w-100 admin-delete-btn" data-id="${m._id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        ` : ''}
      </article>
    </div>
  `).join('');
  list.querySelectorAll('img[data-id]').forEach(img => {
    img.addEventListener('click', () => {
      window.location.href = `movie-details.html?id=${encodeURIComponent(img.dataset.id)}`;
    });
  });

  list.querySelectorAll('.admin-delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!confirm('Delete this movie?')) return;

      try {
        await deleteMovie(btn.dataset.id);
        showToast('Movie deleted!');
        const movies = await getMovies();
        renderMovies(movies);
        document.dispatchEvent(new Event('moviesRendered'));
      } catch (err) {
        showToast(err.message || 'Delete failed', 'error');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const adminPanel = document.getElementById('adminPanel');
  const adminForm = document.getElementById('adminAddMovieForm');
  const adminMsg = document.getElementById('adminMsg');

  const user = getUser();
  const isAdmin = isLoggedIn() && user?.role === 'admin';

  if (adminPanel) adminPanel.style.display = isAdmin ? 'block' : 'none';

  function setAdminMsg(text, type = 'text-danger') {
    if (!adminMsg) return;
    adminMsg.className = type;
    adminMsg.textContent = text;
  }

  if (isAdmin && adminForm) {
    adminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      setAdminMsg('');

      const title = document.getElementById('adminTitle').value.trim();
      const year = Number(document.getElementById('adminYear').value);
      const description = document.getElementById('adminDescription').value.trim();
      const posterUrl = document.getElementById('adminPosterUrl').value.trim();
      const trailerInput = document.getElementById('adminTrailerUrl').value.trim();
const trailerUrl = extractYouTubeId(trailerInput);

      const genresRaw = document.getElementById('adminGenres').value.trim();

      const genre = genresRaw.split(',').map(s => s.trim()).filter(Boolean);

      if (!title || !description || !posterUrl || !genre.length || !year) {
        setAdminMsg('Please fill all required fields', 'text-danger');
        return;
      }

      try {
        await createMovie({ title, year, description, posterUrl, trailerUrl: trailerUrl || '', genre });
        setAdminMsg('✅ Movie created!', 'text-success');

        const movies = await getMovies();
        renderMovies(movies);
        document.dispatchEvent(new Event('moviesRendered'));

        adminForm.reset();
      } catch (err) {
        setAdminMsg(err.message || 'Create movie failed', 'text-danger');
      }
    });
  }

  try {
    const movies = await getMovies();
    renderMovies(movies);
    document.dispatchEvent(new Event('moviesRendered'));
  } catch (err) {
    showToast(err.message || 'Failed to load movies', 'error');
  }
});
