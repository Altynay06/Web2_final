// js/home.js - ТОЛЬКО для загрузки фильмов из API
const API_BASE_URL = 'http://localhost:5000/api';

// Загрузка трендовых фильмов из базы данных
async function loadTrendingMovies() {
  try {
    const response = await fetch(`${API_BASE_URL}/movies?limit=8&sort=-rating`);
    const movies = await response.json();
    
    if (movies && movies.length > 0) {
      renderTrendingMovies(movies);
    } else {
      // Если API не работает, скрываем секцию
      document.getElementById('api-movies-section').style.display = 'none';
    }
  } catch (error) {
    console.error('Error loading trending movies from API:', error);
    // Скрываем секцию если API не доступен
    const sec = document.getElementById('api-movies-section');
    if (sec) sec.style.display = 'none';
  }
}

// Отображение трендовых фильмов
function renderTrendingMovies(movies) {
  const trendingContainer = document.getElementById('trending-movies');
  if (!trendingContainer) return;
  trendingContainer.innerHTML = (movies || []).map(movie => `
    <div class="col-md-6 col-lg-4 col-xl-3">
      <div class="media-card">
        <div class="media-card-image">
          <img src="${movie.posterUrl}" alt="${movie.title}" class="media-img" loading="lazy">
        </div>
        <div class="media-card-content">
          <h3 class="media-title">${movie.title} (${movie.year})</h3>
          <p class="media-genre"><strong>Genre:</strong> ${movie.genre ? movie.genre.join(', ') : ''}</p>
          <p class="media-rating"><strong>Rating:</strong> ${movie.rating ? movie.rating.toFixed(1) : 'N/A'}/5</p>
          <p class="media-plot">${(movie.description || '').substring(0, 80)}...</p>
          <div class="media-card-actions">
            <a href="movie-details.html?id=${movie._id}" class="btn btn-danger trailer-btn">
              <i class="fas fa-info-circle"></i> Details
            </a>
            <button class="btn favorite-btn" data-movie-id="${movie._id}">
              <i class="far fa-heart"></i> Favorite
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  
  // Добавляем обработчики для кнопок избранного
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const movieId = e.target.closest('button').dataset.movieId;
      const userData = localStorage.getItem('user');
      
      if (!userData) {
        showToast('Please login to add favorites', 'error');
        return;
      }
      
      try {
        await addToFavorites(movieId);
        e.target.closest('button').innerHTML = '<i class="fas fa-heart"></i> Added';
        e.target.closest('button').classList.add('added');
        showToast('Added to favorites!');
      } catch (error) {
        showToast('Error adding to favorites', 'error');
      }
    });
  });
}

// Функция добавления в избранное
async function addToFavorites(movieId) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch(`${API_BASE_URL}/users/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ movieId })
  });
  
  if (!response.ok) {
    throw new Error('Failed to add to favorites');
  }
  
  return await response.json();
}

// Всплывающие уведомления
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  
  if (type === 'error') {
    toast.style.borderLeftColor = '#ff4444';
  }
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Инициализация главной страницы
document.addEventListener('DOMContentLoaded', () => {
  loadTrendingMovies();
});
