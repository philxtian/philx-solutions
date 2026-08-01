(function() {
    'use strict';
    
    function initScrollReveals() {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting || entry.target.getBoundingClientRect().top < window.innerHeight) {
                    entry.target.classList.add('reveal-active');
                    observerInstance.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.05, 
            rootMargin: "0px 0px -20px 0px"
        });

        document.querySelectorAll('.reveal-hidden').forEach((el) => {
            // Immediate safety check: if element is already in view on load, reveal it right away
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('reveal-active');
            } else {
                observer.observe(el);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveals);
    } else {
        initScrollReveals();
    }
    
    document.body.addEventListener('htmx:afterSwap', initScrollReveals);
})();
