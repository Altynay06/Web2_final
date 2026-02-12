document.addEventListener('DOMContentLoaded', function() {
    
    const galleryWrappers = document.querySelectorAll('.gallery-wrapper');
    
    const scrollDistance = 700; 

    galleryWrappers.forEach(wrapper => {
        
        const gallery = wrapper.querySelector('.gallery-track.scrollable');
        const leftButton = wrapper.querySelector('.left-arrow');
        const rightButton = wrapper.querySelector('.right-arrow');

        if (!gallery || !leftButton || !rightButton) {
            console.error('Error: Gallery elements or buttons not found in wrapper:', wrapper);
            return;
        }

        const updateArrows = () => {
            
            leftButton.style.display = gallery.scrollLeft > 0 ? 'block' : 'none';

            const isAtEnd = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 1;
            rightButton.style.display = isAtEnd ? 'none' : 'block';
        };

        leftButton.addEventListener('click', () => {
            gallery.scrollLeft -= scrollDistance;
            setTimeout(updateArrows, 300);
        });

        rightButton.addEventListener('click', () => {
            gallery.scrollLeft += scrollDistance;
            setTimeout(updateArrows, 300);
        });

        gallery.addEventListener('scroll', updateArrows);

        updateArrows();
    });
});

