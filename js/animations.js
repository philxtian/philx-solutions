/**
 * PHILX Solutions — 2026 Kinetic Scroll Reveals & Magnetic Hover Physics
 * Hardware-accelerated, 60fps micro-interactions strictly in monochrome.
 */

(function () {
    'use strict';

    /**
     * 1. Kinetic Scroll & Fluid Reveal Observer
     */
    function initScrollReveals() {
        const revealElements = document.querySelectorAll(
            'section, .reveal-on-scroll, #services-grid > div, #about .group, #expertise .border-t, #contact form'
        );

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(el => el.classList.add('is-revealed'));
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            if (!el.classList.contains('reveal-on-scroll')) {
                el.classList.add('reveal-on-scroll');
            }
            observer.observe(el);
        });
    }

    /**
     * 2. Magnetic Hover Physics
     */
    function initMagneticElements() {
        const magneticTargets = document.querySelectorAll(
            'a[href^="#"], button, .magnetic-target'
        );

        magneticTargets.forEach(el => {
            if (el.dataset.magneticInitialized) return;
            el.dataset.magneticInitialized = 'true';

            let boundBox = null;
            let rafId = null;

            function onMouseEnter() {
                boundBox = el.getBoundingClientRect();
                el.style.transition = 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)';
            }

            function onMouseMove(e) {
                if (!boundBox) boundBox = el.getBoundingClientRect();
                const centerX = boundBox.left + boundBox.width / 2;
                const centerY = boundBox.top + boundBox.height / 2;

                const deltaX = (e.clientX - centerX) * 0.25;
                const deltaY = (e.clientY - centerY) * 0.25;

                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    el.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale3d(1.03, 1.03, 1)`;
                });
            }

            function onMouseLeave() {
                if (rafId) cancelAnimationFrame(rafId);
                boundBox = null;
                el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                el.style.transform = 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1)';
            }

            el.addEventListener('mouseenter', onMouseEnter, { passive: true });
            el.addEventListener('mousemove', onMouseMove, { passive: true });
            el.addEventListener('mouseleave', onMouseLeave, { passive: true });
        });
    }

    // Dynamic CSS Injection for Kinetic Scroll Reveal States
    const style = document.createElement('style');
    style.textContent = `
        .reveal-on-scroll {
            opacity: 0;
            transform: translate3d(0, 28px, 0);
            transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: opacity, transform;
        }
        .reveal-on-scroll.is-revealed {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    `;
    document.head.appendChild(style);

    // Initialize on DOM Ready
    function initAll() {
        initScrollReveals();
        initMagneticElements();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    // Re-initialize after HTMX partial swaps
    document.body.addEventListener('htmx:afterSwap', function () {
        setTimeout(initAll, 50);
    });
})();
