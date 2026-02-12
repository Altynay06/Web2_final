document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing filtering system...');

  const filterSections = [
    document.querySelector('.filter-section'),
    document.querySelector('.main.filters'),
    document.querySelector('[aria-label="Content filters"]')
  ].filter(Boolean);

  if (filterSections.length === 0) {
    console.log('No filter sections found on this page.');
    return;
  }

  filterSections.forEach(section => initFilterSection(section));
});

function initFilterSection(section) {
  console.log('Initializing filter section:', section);

  const filterSelects = section.querySelectorAll('.filter-select');
  const resetBtn = section.querySelector('#reset-filters-btn');
  const searchInput = document.querySelector('#media-search');
  const mediaList = document.querySelector('#media-list');

  if (!mediaList) {
    console.error('Media list (#media-list) not found');
    return;
  }

  const getCards = () => Array.from(mediaList.querySelectorAll('.media-card'));

  const filterKeyTranslations = {
    genres: 'Genre',
    countries: 'Country',
    year: 'Year',
    rating: 'Rating'
  };

  const activeFiltersDisplay = document.querySelector('#active-filters-display');
  const noFiltersMsg = document.querySelector('#no-filters-msg');

  let currentFilters = {
    genres: '',
    countries: '',
    year: '',
    rating: '',
    search: ''
  };

  const normalize = (value) => (value || '').toString().trim().toLowerCase();

  function normalizeYearFilter(rawValue) {
    const value = normalize(rawValue);
    if (/^\d{4}$/.test(value)) {
      const decade = Math.floor(parseInt(value, 10) / 10) * 10;
      return `${decade}s`;
    }
    return value;
  }

  function loadSavedFilters() {
    const savedFilters = localStorage.getItem('myflix-filters');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        currentFilters = { ...currentFilters, ...parsed };
        console.log('Loaded saved filters:', currentFilters);
      } catch (e) {
        console.error('Error parsing saved filters:', e);
      }
    }
  }

  function applyFilters() {
    const cards = getCards();

    if (cards.length === 0) {
      console.warn('No media cards found to filter (yet). Waiting for render...');
      return;
    }

    console.log('Applying filters:', currentFilters);

    let visibleCount = 0;

    cards.forEach(card => {
      let isVisible = true;

      for (const [filterKey, filterValue] of Object.entries(currentFilters)) {
        if (!filterValue) continue;

        if (filterKey === 'search') {
          const title = card.querySelector('.media-title')?.textContent?.toLowerCase() || '';
          if (!title.includes(filterValue.toLowerCase())) {
            isVisible = false;
            break;
          }
          continue;
        }

        if (filterKey === 'rating') {
          const cardRating = parseFloat(card.getAttribute('data-rating') || '0');
          const requiredRating = parseFloat(filterValue);
          if (isNaN(cardRating) || cardRating < requiredRating) {
            isVisible = false;
            break;
          }
          continue;
        }

        if (filterKey === 'year') {
          const normalizedFilterValue = normalizeYearFilter(filterValue);
          const cardYear = card.getAttribute('data-year') || '';

          if (normalizedFilterValue.includes('s')) {
            const cardYearNum = parseInt(cardYear, 10);
            if (!isNaN(cardYearNum)) {
              const cardDecade = Math.floor(cardYearNum / 10) * 10;
              const filterDecade = parseInt(normalizedFilterValue, 10);
              if (cardDecade !== filterDecade) {
                isVisible = false;
                break;
              }
            }
          } else {
            const cardYearStr = cardYear.toString();
            if (!cardYearStr.includes(filterValue)) {
              isVisible = false;
              break;
            }
          }
          continue;
        }

        const cardValue = card.getAttribute(`data-${filterKey}`) || '';
        const filterValues = filterValue.split(',').map(v => normalize(v));
        const cardValues = cardValue.split(',').map(v => normalize(v));

        const hasMatch = filterValues.some(filterVal =>
          cardValues.some(cardVal => cardVal.includes(filterVal))
        );

        if (!hasMatch) {
          isVisible = false;
          break;
        }
      }

      const cardContainer = card.closest('[class*="col-"]');
      if (cardContainer) {
        if (isVisible) {
          cardContainer.style.display = '';
          visibleCount++;
        } else {
          cardContainer.style.display = 'none';
        }
      }
    });

    console.log(`${visibleCount} out of ${cards.length} cards visible`);

    if (visibleCount === 0) showNoResultsMessage();
    else hideNoResultsMessage();
  }

  function updateActiveFiltersDisplay() {
    if (!activeFiltersDisplay) return;

    activeFiltersDisplay.innerHTML = '';
    let hasActiveFilters = false;

    for (const [key, value] of Object.entries(currentFilters)) {
      if (!value) continue;
      hasActiveFilters = true;

      let displayText = value;

      if (key !== 'search') {
        const select = document.querySelector(`#filter-${key}`);
        if (select) {
          const option = select.querySelector(`option[value="${value}"]`);
          if (option) {
            displayText = `${filterKeyTranslations[key] || key}: ${option.textContent}`;
          }
        }
      } else {
        displayText = `Search: ${value}`;
      }

      const filterTag = document.createElement('span');
      filterTag.className = 'filter-tag';
      filterTag.innerHTML = `
        ${displayText}
        <button type="button" class="filter-remove-btn" data-filter="${key}" aria-label="Remove ${key} filter">
          &times;
        </button>
      `;

      activeFiltersDisplay.appendChild(filterTag);
    }

    if (noFiltersMsg) noFiltersMsg.style.display = hasActiveFilters ? 'none' : 'inline';

    saveFiltersToStorage();
  }

  function saveFiltersToStorage() {
    try {
      localStorage.setItem('myflix-filters', JSON.stringify(currentFilters));
    } catch (e) {
      console.error('Error saving filters to localStorage:', e);
    }
  }

  function setFilter(filterKey, value) {
    currentFilters[filterKey] = value || '';
    updateActiveFiltersDisplay();
    applyFilters();
  }

  function removeFilter(filterKey) {
    currentFilters[filterKey] = '';

    if (filterKey !== 'search') {
      const select = document.querySelector(`#filter-${filterKey}`);
      if (select) select.value = '';
    } else if (searchInput) {
      searchInput.value = '';
    }

    updateActiveFiltersDisplay();
    applyFilters();
  }

  function resetAllFilters() {
    Object.keys(currentFilters).forEach(key => (currentFilters[key] = ''));

    filterSelects.forEach(select => (select.value = ''));
    if (searchInput) searchInput.value = '';

    localStorage.removeItem('myflix-filters');

    updateActiveFiltersDisplay();
    applyFilters();

    console.log('All filters reset');
  }

  function showNoResultsMessage() {
    let noResultsMsg = document.querySelector('.no-results-message');

    if (!noResultsMsg) {
      noResultsMsg = document.createElement('div');
      noResultsMsg.className = 'no-results-message alert alert-warning text-center mt-4';
      noResultsMsg.innerHTML = `
        <i class="fas fa-search me-2"></i>
        No results found for the selected filters. Try adjusting your search criteria.
      `;

      mediaList.parentNode.insertBefore(noResultsMsg, mediaList.nextSibling);
    } else {
      noResultsMsg.style.display = 'block';
    }
  }

  function hideNoResultsMessage() {
    const noResultsMsg = document.querySelector('.no-results-message');
    if (noResultsMsg) noResultsMsg.style.display = 'none';
  }

  function initializeEventListeners() {
    filterSelects.forEach(select => {
      const filterKey = select.getAttribute('data-filter-key');
      if (!filterKey) return;

      if (currentFilters[filterKey]) select.value = currentFilters[filterKey];

      select.addEventListener('change', function () {
        setFilter(filterKey, this.value);
      });
    });

    if (searchInput) {
      if (currentFilters.search) searchInput.value = currentFilters.search;

      let searchTimeout;
      searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
          setFilter('search', this.value.trim());
        }, 300);
      });
    }

    if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);

    document.addEventListener('click', function (e) {
      const removeBtn = e.target.closest('.filter-remove-btn');
      if (removeBtn) {
        const filterKey = removeBtn.getAttribute('data-filter');
        if (filterKey) removeFilter(filterKey);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        const active = Object.entries(currentFilters)
          .filter(([_, value]) => value)
          .map(([key]) => key);
        if (active.length > 0) removeFilter(active[active.length - 1]);
      }
    });
  }

  function initialize() {
    loadSavedFilters();
    initializeEventListeners();
    updateActiveFiltersDisplay();

    if (Object.values(currentFilters).some(v => v)) applyFilters();

    console.log('Filter system initialized successfully');
  }

  document.addEventListener('moviesRendered', () => {
    console.log('moviesRendered event received -> applying filters');
    applyFilters();
  });

  initialize();
}
