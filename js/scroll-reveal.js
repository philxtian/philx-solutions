(function() {
    'use strict';
    
    function initScrollReveals() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observer.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of the element is visible
            rootMargin: "0px 0px -50px 0px"
        });

        const elements = document.querySelectorAll('.reveal-hidden');
        elements.forEach(el => observer.observe(el));
    }

    function initCardSpotlights() {
        const cards = document.querySelectorAll('.spotlight-card, [class*="bg-white/\\[']);
        cards.forEach(card => {
            if (card.dataset.spotlightBound === 'true') return;
            card.dataset.spotlightBound = 'true';
            card.classList.add('spotlight-card');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    function initAll() {
        initScrollReveals();
        initCardSpotlights();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    document.body.addEventListener('htmx:afterSwap', initAll);
})();
