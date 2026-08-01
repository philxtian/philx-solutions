/**
 * PHILX Solutions — 2026 Kinetic Scroll Reveals, Magnetic Physics & Adaptive Context-Aware Navbar
 * Hardware-accelerated, 60fps micro-interactions strictly in monochrome.
 */

(function () {
    'use strict';

    /**
     * 1. Kinetic Scroll & Fluid Reveal Observer
     */
    function initScrollReveals() {
        const revealElements = document.querySelectorAll(
            'section, .reveal-on-scroll, #services-grid > div, #about .group, #expertise > div, #contact form'
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

                const deltaX = (e.clientX - centerX) * 0.22;
                const deltaY = (e.clientY - centerY) * 0.22;

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

    /**
     * 3. Dynamic Context-Aware Adaptive Navbar Theme Inverter
     */
    function initAdaptiveNavbar() {
        const capsule = document.getElementById('navbar-capsule');
        if (!capsule) return;

        const sections = document.querySelectorAll('section[data-section-theme], footer[data-section-theme]');
        if (!sections.length) return;

        const logoBlack = capsule.querySelector('.nav-logo-black');
        const logoWhite = capsule.querySelector('.nav-logo-white');
        const title = capsule.querySelector('.nav-title');
        const subtitle = capsule.querySelector('.nav-subtitle');
        const links = capsule.querySelectorAll('.nav-link');
        const underlines = capsule.querySelectorAll('.nav-underline');
        const cta = capsule.querySelector('.nav-cta');
        const mobileBtn = capsule.querySelector('.nav-mobile-btn');

        const navObserverOptions = {
            root: null,
            rootMargin: '-5% 0px -85% 0px',
            threshold: 0
        };

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const theme = entry.target.getAttribute('data-section-theme');

                    if (theme === 'dark') {
                        // Floating over dark section -> Navbar renders light mode iOS27 glass
                        capsule.classList.remove('bg-white/[0.05]', 'border-white/[0.1]', 'shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]', 'bg-black/90', 'text-white', 'border-white/15');
                        capsule.classList.add('bg-white/[0.4]', 'backdrop-blur-3xl', 'border', 'border-white/[0.6]', 'shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]', 'text-slate-900');

                        if (logoBlack) {
                            logoBlack.classList.remove('opacity-0');
                            logoBlack.classList.add('opacity-100');
                        }
                        if (logoWhite) {
                            logoWhite.classList.remove('opacity-100');
                            logoWhite.classList.add('opacity-0');
                        }

                        if (title) title.className = 'nav-title flex justify-between font-black text-slate-900 leading-none text-[13px] uppercase';
                        if (subtitle) subtitle.className = 'nav-subtitle flex justify-between text-[9px] font-bold text-slate-500 leading-none mt-1 uppercase';
                        links.forEach(l => l.className = 'nav-link relative py-1 text-slate-700 hover:text-black transition-colors group');
                        underlines.forEach(u => u.className = 'nav-underline absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 ease-out group-hover:w-full');
                        if (cta) cta.className = 'nav-cta hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-bold text-white bg-black hover:bg-slate-800 rounded-full border border-black transition-all shadow-md relative z-30 cursor-pointer uppercase tracking-widest';
                        if (mobileBtn) mobileBtn.className = 'nav-mobile-btn md:hidden p-2 rounded-full border border-black/15 bg-slate-100 text-slate-900 transition-colors backdrop-blur-md relative z-30 cursor-pointer';
                    } else if (theme === 'light') {
                        // Floating over light section -> Navbar inverts to dark (black bg + white text)
                        capsule.classList.remove('bg-white/90', 'text-slate-900', 'border-black/15');
                        capsule.classList.add('bg-black/90', 'text-white', 'border-white/15');

                        if (logoBlack) {
                            logoBlack.classList.remove('opacity-100');
                            logoBlack.classList.add('opacity-0');
                        }
                        if (logoWhite) {
                            logoWhite.classList.remove('opacity-0');
                            logoWhite.classList.add('opacity-100');
                        }

                        if (title) title.className = 'nav-title flex justify-between font-black text-white leading-none text-[13px] uppercase';
                        if (subtitle) subtitle.className = 'nav-subtitle flex justify-between text-[9px] font-bold text-zinc-400 leading-none mt-1 uppercase';
                        links.forEach(l => l.className = 'nav-link relative py-1 text-zinc-300 hover:text-white transition-colors group');
                        underlines.forEach(u => u.className = 'nav-underline absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 ease-out group-hover:w-full');
                        if (cta) cta.className = 'nav-cta hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-full border border-white transition-all shadow-md relative z-30 cursor-pointer uppercase tracking-widest';
                        if (mobileBtn) mobileBtn.className = 'nav-mobile-btn md:hidden p-2 rounded-full border border-white/15 bg-zinc-900 text-white transition-colors backdrop-blur-md relative z-30 cursor-pointer';
                    }
                }
            });
        }, navObserverOptions);

        sections.forEach(s => navObserver.observe(s));
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
        initAdaptiveNavbar();
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
