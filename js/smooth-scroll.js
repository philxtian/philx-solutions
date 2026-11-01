// Single owner of in-page anchor scrolling, including htmx content.
(function() {
    'use strict';

    document.documentElement.style.scrollBehavior = 'auto';

    function getNavbarOffset() {
        // Includes safe-area padding without counting the open drawer.
        const capsule = document.getElementById('navbar-capsule');
        if (!capsule) return 0;
        const rect = capsule.getBoundingClientRect();
        return rect.height > 0 ? rect.bottom + 12 : 0;
    }

    document.addEventListener('click', function(evt) {
        const link = evt.target.closest && evt.target.closest('a[href^="#"]');
        if (!link || evt.defaultPrevented || evt.button > 0 ||
            evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey) return;
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        let targetElement;
        try {
            targetElement = document.querySelector(targetId);
        } catch (err) {
            return; // Leave invalid selectors to the browser.
        }
        if (!targetElement) return;

        evt.preventDefault();
        link.blur();
        const menu = document.getElementById('mobile-menu');
        if (menu) menu.classList.add('hidden');

        const absoluteTop = targetElement.getBoundingClientRect().top + window.scrollY;
        const maxScroll = Math.max(0,
            document.documentElement.scrollHeight - window.innerHeight);
        const top = Math.min(Math.max(absoluteTop - getNavbarOffset(), 0), maxScroll);
        const reducedMotion = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Native scrolling accepts a new destination on every tap.
        if ('scrollBehavior' in document.documentElement.style && !reducedMotion) {
            window.scrollTo({ top: top, behavior: 'smooth' });
        } else {
            window.scrollTo(0, top);
        }
    });
})();
