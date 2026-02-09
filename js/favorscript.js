document.addEventListener('DOMContentLoaded', () => {
  const favButtons = document.querySelectorAll('.favorite-btn');
  const favoritesContainer = document.getElementById('favoritesContainer');
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favButtons.length > 0) {
    favButtons.forEach(btn => {
      const title = btn.dataset.title;
      const image = btn.dataset.image;

      if (favorites.some(f => f.title === title)) {
        btn.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorite';
        btn.classList.add('added');
      }

      btn.addEventListener('click', () => {
        const index = favorites.findIndex(f => f.title === title);

        if (index === -1) {
          favorites.push({ title, image });
          btn.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorite';
          btn.classList.add('added');
          showNotification(`✅ "${title}" added to Favorites!`);
        } else {
          favorites.splice(index, 1);
          btn.innerHTML = '<i class="fas fa-heart"></i> Add to Favorite';
          btn.classList.remove('added');
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
      favoritesContainer.innerHTML = '<div class="col-12"><p class="text-center text-muted py-5">No favorites yet 😢 Add some movies to your favorites!</p></div>';
      return;
    }

    favorites.forEach((item, index) => {
      const col = document.createElement('div');
      col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4';
      
      const card = document.createElement('div');
      card.className = 'favorite-card';
      
      card.innerHTML = `
        <div class="favorite-card-image-container">
          <img src="${item.image}" alt="${item.title}" class="favorite-card-img">
        </div>
        <div class="favorite-card-content">
          <h5 class="favorite-card-title">${item.title}</h5>
          <button class="remove-favorite-btn" data-index="${index}">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      `;
      
      col.appendChild(card);
      favoritesContainer.appendChild(col);
    });

    document.querySelectorAll('.remove-favorite-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const i = parseInt(e.target.closest('.remove-favorite-btn').dataset.index);
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