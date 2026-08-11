(function() {
    'use strict';

    function reveal(el, observerInstance) {
        el.classList.remove('reveal-hidden');
        el.classList.add('reveal-active');
        if (observerInstance) observerInstance.unobserve(el);
    }

    function initScrollReveals() {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting || entry.target.getBoundingClientRect().top < window.innerHeight) {
                    reveal(entry.target, observerInstance);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px -20px 0px"
        });

        // Only bind elements not already processed by a prior call (htmx fires
        // afterSwap once per partial, so this runs once per section as it loads;
        // the flag stops re-observing already-revealed content on later swaps).
        document.querySelectorAll('.reveal-hidden:not([data-reveal-bound])').forEach((el) => {
            el.dataset.revealBound = 'true';
            // Immediate safety check: if element is already in view on load, reveal it right away
            if (el.getBoundingClientRect().top < window.innerHeight) {
                reveal(el, null);
            } else {
                observer.observe(el);
                // Hard-timeout failsafe: guarantees content can never stay invisible
                // indefinitely if an observer ever fails to fire (e.g. a timing race
                // against htmx's async, unordered partial loading on a slow connection).
                setTimeout(() => reveal(el, observer), 1800);
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
