function setupAccordion() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        const content = header.nextElementSibling;
        
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true' || false;
            
            if (isExpanded) {
                content.style.maxHeight = 0;
                header.setAttribute('aria-expanded', 'false');
            } 
            else {
                closeAllOtherAccordions(header);
                
                content.style.maxHeight = content.scrollHeight + 'px';
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

function closeAllOtherAccordions(currentHeader) {
    const allHeaders = document.querySelectorAll('.accordion-header');
    
    allHeaders.forEach(header => {
        if (header !== currentHeader && header.getAttribute('aria-expanded') === 'true') {
            const contentToClose = header.nextElementSibling;
            
            contentToClose.style.maxHeight = 0;
            header.setAttribute('aria-expanded', 'false');
        }
    });
}


document.addEventListener('DOMContentLoaded', setupAccordion);