document.addEventListener('DOMContentLoaded', () => {
  const favButtons = document.querySelectorAll('.favorite-btn');
  const favoritesContainer = document.getElementById('favorites-container');
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favButtons.length > 0) {
    favButtons.forEach(btn => {
      const title = btn.dataset.title;
      const image = btn.dataset.image;

      if (favorites.some(f => f.title === title)) {
        btn.textContent = '💔 Remove from Favorite';
      }

      btn.addEventListener('click', () => {
        const index = favorites.findIndex(f => f.title === title);

        if (index === -1) {
          favorites.push({ title, image });
          btn.textContent = '💔 Remove from Favorite';
          showNotification(`✅ "${title}" added to Favorites!`);
        } else {
          favorites.splice(index, 1);
          btn.textContent = '❤️ Add to Favorite';
          showNotification(`❌ "${title}" removed from Favorites!`);
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
      });
    });
  }

  if (favoritesContainer) {
    renderFavorites();
  }

  function renderFavorites() {
    favoritesContainer.innerHTML = '';

    if (favorites.length === 0) {
      favoritesContainer.innerHTML = '<p class="text-center text-muted">No favorites yet 😢</p>';
      return;
    }

    favorites.forEach((item, index) => {
      const card = document.createElement('div');
      card.classList.add('favorite-card', 'text-center', 'mb-4');
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="img-fluid mb-3" style="max-width:200px;border-radius:10px;">
        <h5 class="text-white">${item.title}</h5>
        <button class="btn btn-danger mt-2 remove-btn" data-index="${index}">Remove</button>
      `;
      favoritesContainer.appendChild(card);
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const i = e.target.dataset.index;
        const removed = favorites[i].title;
        favorites.splice(i, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showNotification(`❌ "${removed}" removed from Favorites!`);
        renderFavorites();
      });
    });
  }

  function showNotification(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'toast-message';
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      background: '#222',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '10px',
      zIndex: 10000,
      opacity: 1,
      transition: 'opacity 0.5s ease',
    });
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = 0;
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  }
});
