// js/favorites-page.js
import { isLoggedIn } from './session.js';
import { getFavorites, removeFromFavorites } from './api.js';

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  if (type === 'error') toast.style.borderLeftColor = '#ff4444';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function renderFavorites(list, favorites) {
  if (!favorites || favorites.length === 0) {
    list.innerHTML = `
      <div class="col-12">
        <p class="text-center text-muted py-5">No favorites yet</p>
      </div>`;
    return;
  }

  list.innerHTML = favorites.map(m => `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4">
      <div class="favorite-card">
        <div class="favorite-card-image-container">
          <img src="${m.posterUrl || 'images/placeholder.jpg'}" alt="${m.title || 'Movie'}" class="favorite-card-img">
        </div>
        <div class="favorite-card-content">
          <h5 class="favorite-card-title">${m.title || ''}</h5>
          <button class="remove-favorite-btn" data-id="${m._id}">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.remove-favorite-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (!confirm('Remove from favorites?')) return;

      try {
        await removeFromFavorites(id);
        showToast('Removed from favorites!');
        const updated = await getFavorites();
        renderFavorites(list, updated);
      } catch (e) {
        showToast(e.message || 'Remove failed', 'error');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  const list = document.getElementById('favoritesContainer');
  if (!list) return;

  try {
    const favorites = await getFavorites();
    renderFavorites(list, favorites);
  } catch (e) {
    showToast(e.message || 'Failed to load favorites', 'error');
  }
});
