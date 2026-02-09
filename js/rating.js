document.addEventListener('DOMContentLoaded', () => {
    const ratingContainers = document.querySelectorAll('.user-rating');

    if (ratingContainers.length === 0) {
        console.log('No .user-rating containers found on this page.');
        return;
    }

    ratingContainers.forEach(container => {
        const mediaIdElement = container.closest('[data-series-id], [data-movie-id], [data-cartoon-id], .media-card');

const mediaId =
  mediaIdElement?.getAttribute('data-series-id') ||
  mediaIdElement?.getAttribute('data-movie-id') ||
  mediaIdElement?.getAttribute('data-cartoon-id') ||
  mediaIdElement?.querySelector('h3')?.textContent.trim().replace(/\s+/g, "_").toLowerCase();

        
        const stars = container.querySelectorAll('.star');
        const messageElement = container.querySelector('.user-rating-message');

        if (!mediaId || !stars.length || !messageElement) {
            console.error('Missing media ID, stars, or message element in a rating container.');
            return;
        }

        const storageKey = `userRating_${mediaId}`;
        
        const savedRating = localStorage.getItem(storageKey);
        if (savedRating) {
            updateRatingDisplay(parseInt(savedRating), stars, messageElement, mediaId);
        } else {
            messageElement.textContent = 'Click a star to rate!';
            messageElement.classList.add('text-danger');
        }

        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-value'));
                
                updateRatingDisplay(rating, stars, messageElement, mediaId);

                localStorage.setItem(storageKey, rating);

                console.log(`User rated ${mediaId} with ${rating} stars. (Saved to localStorage)`);
            });
            
            star.addEventListener('mouseover', () => {
                const hoverRating = parseInt(star.getAttribute('data-value'));
                highlightStars(hoverRating, stars);
            });

            star.addEventListener('mouseout', () => {
                const currentRating = parseInt(localStorage.getItem(storageKey) || 0);
                highlightStars(currentRating, stars);
            });
        });
        
        const initialRating = parseInt(savedRating || 0);
        highlightStars(initialRating, stars);
    });
});

function highlightStars(rating, stars) {
    stars.forEach(star => {
        const starValue = parseInt(star.getAttribute('data-value'));
        if (starValue <= rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

function updateRatingDisplay(rating, stars, messageElement, mediaId) {
    highlightStars(rating, stars);

    const message = `You rated this ${rating} out of 5 stars.`;
    messageElement.textContent = message;
    
    messageElement.classList.remove('text-danger');
    messageElement.classList.add('text-success');
}