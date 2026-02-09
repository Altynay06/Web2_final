
document.addEventListener('DOMContentLoaded', function() {
    console.log('Trailer system loading...');
    initTrailerSystem();
});

function initTrailerSystem() {
    const modal = document.getElementById('trailerModal');
    const videoContainer = document.getElementById('video-container');
    
    if (!modal || !videoContainer) {
        console.error('Modal elements not found!');
        return;
    }
    
    console.log('Found modal:', modal);
    console.log('Found video container:', videoContainer);
    
    function openTrailer(title, youtubeKey) {
        console.log('Opening trailer:', title, 'Key:', youtubeKey);
        
        if (!youtubeKey || youtubeKey === 'undefined') {
            alert('Трейлер недоступен для этого фильма');
            return;
        }
        
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0&modestbranding=1`;
        iframe.title = `${title} Trailer`;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        
        videoContainer.innerHTML = '';
        videoContainer.appendChild(iframe);
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        console.log('Modal opened - should be large and centered');
    }
    
    function closeTrailer() {
        console.log('Closing trailer');
        
        const iframe = videoContainer.querySelector('iframe');
        if (iframe) {
            iframe.src = '';
        }
        
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            videoContainer.innerHTML = '';
        }, 300);
    }
    
    document.addEventListener('click', function(e) {
        const trailerBtn = e.target.closest('.trailer-btn');
        
        if (trailerBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const trailerKey = trailerBtn.getAttribute('data-trailer-key');
            const card = trailerBtn.closest('.media-card');
            let title = 'Trailer';
            
            if (card) {
                const titleEl = card.querySelector('.media-title');
                if (titleEl) title = titleEl.textContent.trim();
            }
            
            openTrailer(title, trailerKey);
            return;
        }
        
        if (e.target.classList.contains('close-trailer-btn')) {
            closeTrailer();
            return;
        }
        
        if (e.target === modal) {
            closeTrailer();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeTrailer();
        }
    });
    
    console.log('Trailer system initialized successfully');
    console.log('Found ' + document.querySelectorAll('.trailer-btn').length + ' trailer buttons');
}