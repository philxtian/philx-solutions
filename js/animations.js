/**
 * PHILX Solutions — 2026 Kinetic Scroll Reveals, Magnetic Physics & Adaptive Context-Aware Navbar
 * Hardware-accelerated, 60fps micro-interactions strictly in monochrome.
 */

(function () {
    'use strict';

    /**
     * 1. Kinetic Scroll & Fluid Reveal Observer
     * NOTE: reveal-on-scroll is owned exclusively by js/scroll-reveal.js (targets
     * .reveal-hidden on inner content only, with an immediate-visibility check and
     * a hard-timeout failsafe). This file used to run a second, competing observer
     * that additionally hid entire <section> elements (not just inner cards) with
     * no safety check — if it ever raced against htmx's async partial loading, a
     * whole section could get stuck at opacity:0, indistinguishable from unstyled
     * black. Removed rather than duplicated.
     */

    /**
     * 2. Magnetic Hover Physics
     */
    function initMagneticElements() {
        // mousemove-only effect; never fires on touch, so skip on touchscreens.
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

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
        const fluidPill = capsule.querySelector('#nav-fluid-pill');
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
                        // Floating over dark section -> Navbar renders dark section translucent glass & crisp white text
                        capsule.classList.remove('bg-white/70', 'border-white/90', 'shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]', 'bg-white/90', 'text-slate-900', 'text-gray-900', 'border-black/15');
                        capsule.classList.add('bg-white/[0.05]', 'backdrop-blur-3xl', 'border', 'border-white/[0.1]', 'shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]', 'text-white');

                        if (logoBlack) {
                            logoBlack.classList.remove('opacity-100');
                            logoBlack.classList.add('opacity-0');
                        }
                        if (logoWhite) {
                            logoWhite.classList.remove('opacity-0');
                            logoWhite.classList.add('opacity-100');
                        }

                        if (title) title.className = 'nav-title flex justify-between font-black text-white leading-none text-[13px] uppercase';
                        if (subtitle) subtitle.className = 'nav-subtitle flex justify-between text-[9px] font-bold text-white/80 leading-none mt-1 uppercase';
                        links.forEach(l => l.className = 'nav-link relative z-10 px-4 py-1.5 text-white/90 hover:text-white transition-colors');
                        if (fluidPill) fluidPill.className = 'absolute top-0 bottom-0 rounded-full bg-white/15 backdrop-blur-md border border-white/25 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0 shadow-[0_4px_16px_rgba(255,255,255,0.08)]';
                        if (cta) cta.className = 'nav-cta hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:bg-white/20 transition-all duration-300 relative z-30 cursor-pointer uppercase tracking-widest';
                        if (mobileBtn) mobileBtn.className = 'nav-mobile-btn md:hidden p-2 rounded-full border border-white/20 bg-white/10 text-white shadow-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-md relative z-30 cursor-pointer';
                    } else if (theme === 'light') {
                        // Floating over light/white section -> Navbar renders light iOS27 glass & high-contrast dark text
                        capsule.classList.remove('bg-white/[0.05]', 'border-white/[0.1]', 'shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]', 'bg-black/90', 'text-white', 'border-white/15');
                        capsule.classList.add('bg-white/70', 'backdrop-blur-3xl', 'border', 'border-white/90', 'shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]', 'text-gray-900');

                        if (logoBlack) {
                            logoBlack.classList.remove('opacity-0');
                            logoBlack.classList.add('opacity-100');
                        }
                        if (logoWhite) {
                            logoWhite.classList.remove('opacity-100');
                            logoWhite.classList.add('opacity-0');
                        }

                        if (title) title.className = 'nav-title flex justify-between font-black text-gray-900 leading-none text-[13px] uppercase';
                        if (subtitle) subtitle.className = 'nav-subtitle flex justify-between text-[9px] font-bold text-gray-600 leading-none mt-1 uppercase';
                        links.forEach(l => l.className = 'nav-link relative z-10 px-4 py-1.5 text-gray-800 hover:text-black transition-colors');
                        if (fluidPill) fluidPill.className = 'absolute top-0 bottom-0 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0 shadow-sm';
                        if (cta) cta.className = 'nav-cta hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-bold text-gray-900 bg-black/[0.03] backdrop-blur-md border border-black/10 rounded-full shadow-sm hover:bg-black/[0.06] transition-all duration-300 relative z-30 cursor-pointer uppercase tracking-widest';
                        if (mobileBtn) mobileBtn.className = 'nav-mobile-btn md:hidden p-2 rounded-full border border-gray-900/20 bg-gray-900/10 text-gray-900 shadow-lg hover:bg-gray-900/20 transition-all duration-300 backdrop-blur-md relative z-30 cursor-pointer';
                    }
                }
            });
        }, navObserverOptions);

        sections.forEach(s => navObserver.observe(s));
    }

    /**
     * Fluid Liquid Glass Island Navbar Tracker
     */
    function initLiquidNavPill() {
        const navContainer = document.querySelector('header nav');
        const pill = document.getElementById('nav-fluid-pill');
        if (!navContainer || !pill) return;

        const navLinks = navContainer.querySelectorAll('.nav-link');
        let activeLink = navContainer.querySelector('.nav-link.is-active') || navLinks[0];

        function updateNavPill(targetElement) {
            if (!targetElement) {
                pill.style.opacity = '0';
                return;
            }
            pill.style.left = `${targetElement.offsetLeft}px`;
            pill.style.width = `${targetElement.offsetWidth}px`;
            pill.style.opacity = '1';
        }

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                updateNavPill(link);
            });
            link.addEventListener('click', () => {
                navLinks.forEach(l => l.classList.remove('is-active'));
                link.classList.add('is-active');
                activeLink = link;
                updateNavPill(activeLink);
            });
        });

        navContainer.addEventListener('mouseleave', () => {
            updateNavPill(activeLink);
        });

        // Initial position sync
        setTimeout(() => updateNavPill(activeLink), 100);

        // Scrollspy active link observer
        const sections = document.querySelectorAll('section[id]');
        if (sections.length && 'IntersectionObserver' in window) {
            const spyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        const matchingLink = navContainer.querySelector(`.nav-link[href="#${id}"]`);
                        if (matchingLink) {
                            navLinks.forEach(l => l.classList.remove('is-active'));
                            matchingLink.classList.add('is-active');
                            activeLink = matchingLink;
                            if (!navContainer.matches(':hover')) {
                                updateNavPill(activeLink);
                            }
                        }
                    }
                });
            }, { rootMargin: '-30% 0px -50% 0px', threshold: 0 });

            sections.forEach(sec => spyObserver.observe(sec));
        }
    }

    // Initialize on DOM Ready
    function initAll() {
        initMagneticElements();
        initAdaptiveNavbar();
        initLiquidNavPill();
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
