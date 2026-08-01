(function() {
    'use strict';
    
    function initSpotlight() {
        const cards = document.querySelectorAll('.group.relative, .group[class*="bg-white/\\['], [class*="bg-white/\\[']');
        
        cards.forEach(card => {
            if (card.dataset.spotlightBound === 'true') return;
            card.dataset.spotlightBound = 'true';
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSpotlight);
    } else {
        initSpotlight();
    }
    
    document.body.addEventListener('htmx:afterSwap', initSpotlight);
})();
