/**
 * PHILX Solutions — 2026 Navbar Positioned Left-to-Right Pill Reveal & Staggered Nav Animation
 * ARCHITECTURE:
 *   - Frame-One Anchoring: Circle & Logo initialize at target navbar left position (no screen-center jump).
 *   - Left-to-Right Pill Expansion: Background pill expands horizontally to full navbar width.
 *   - Staggered Sequential Reveal: Individual navbar links & CTA button fade and slide in sequentially.
 */

(function () {
    'use strict';

    // Session Guard disabled for active testing mode
    /*
    const INTRO_SESSION_KEY = 'philx_intro_seen';
    if (sessionStorage.getItem(INTRO_SESSION_KEY) === 'true') {
        return;
    }
    */

    if (window.PHILX_INTRO_ACTIVE) return;
    window.PHILX_INTRO_ACTIVE = true;

    const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

    // Fullscreen Pure Black Overlay
    const overlay = document.createElement('div');
    overlay.id = 'intro-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:99999;pointer-events:none;transition:opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);';

    // Expanding Pill & Stationary Logo Elements
    overlay.innerHTML = `
        <div id="intro-bg-pill" style="position:fixed;background:#ffffff;box-shadow:0 25px 60px -15px rgba(0,0,0,0.6);border-radius:9999px;transform:scale(0);transform-origin:left center;will-change:width, transform;z-index:1;overflow:hidden;"></div>
        
        <div id="intro-static-logo" style="position:fixed;z-index:2;pointer-events:none;display:flex;align-items:center;opacity:0;transform:scale(0.9);will-change:opacity, transform;">
            <div style="display:flex;align-items:center;" class="space-x-3">
                <div style="width:36px;height:36px;position:relative;flex-shrink:0;">
                    <img src="assets/logo-mark-black.png" alt="PHILX Logo" style="width:36px;height:36px;object-fit:contain;border-radius:8px;display:block;">
                </div>
                <div style="display:flex;flex-direction:column;justify-content:center;width:72px;flex-shrink:0;">
                    <div style="display:flex;justify-content:space-between;font-weight:900;color:#000000;line-height:1;font-size:13px;text-transform:uppercase;letter-spacing:0;">
                        <span>P</span><span>H</span><span>I</span><span>L</span><span>X</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:700;color:#64748b;line-height:1;margin-top:4px;text-transform:uppercase;letter-spacing:0;">
                        <span>S</span><span>O</span><span>L</span><span>U</span><span>T</span><span>I</span><span>O</span><span>N</span><span>S</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    function mountOverlay() {
        if (!document.getElementById('intro-overlay')) {
            (document.body || document.documentElement).appendChild(overlay);
        }
    }

    if (document.body) {
        mountOverlay();
    } else {
        document.addEventListener('DOMContentLoaded', mountOverlay);
    }

    function runSequence() {
        mountOverlay();

        const bgPill = document.getElementById('intro-bg-pill');
        const staticLogo = document.getElementById('intro-static-logo');
        const navbarCapsule = document.getElementById('navbar-capsule');

        if (!bgPill || !staticLogo || !navbarCapsule) {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                }, 750);
            }, 400);
            return;
        }

        // Measure exact navbar & logo bounding box
        const navbarLogo = navbarCapsule.querySelector('a');
        const navRect = navbarCapsule.getBoundingClientRect();
        const logoRect = navbarLogo ? navbarLogo.getBoundingClientRect() : null;

        const targetLogoTop = logoRect ? logoRect.top : (navRect.top + (navRect.height - 36) / 2);
        const targetLogoLeft = logoRect ? logoRect.left : (navRect.left + 24);
        const logoWidth = logoRect ? logoRect.width : 120;
        const paddingLeft = Math.max(16, targetLogoLeft - navRect.left);

        const initialPillWidth = Math.max(navRect.height, paddingLeft + logoWidth + paddingLeft);

        // Frame 1: Position white background pill at exact top-left of navbar position
        bgPill.style.top = `${navRect.top}px`;
        bgPill.style.left = `${navRect.left}px`;
        bgPill.style.height = `${navRect.height}px`;
        bgPill.style.width = `${initialPillWidth}px`;
        bgPill.style.transform = 'scale(0)';

        // Frame 1: Anchor static logo layer at exact target navbar coordinates
        staticLogo.style.top = `${targetLogoTop}px`;
        staticLogo.style.left = `${targetLogoLeft}px`;

        // Initially hide navbar links & CTA for staggered sequential reveal
        const navItems = navbarCapsule.querySelectorAll('.nav-link, .nav-cta, .nav-mobile-btn');
        navItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translate3d(0, 10px, 0)';
            item.style.transition = `opacity 0.4s ${EASE}, transform 0.4s ${EASE}`;
        });

        // Phase 1 (0.05s - 0.65s): Scale in circle/pill & fade in logo at navbar left
        setTimeout(() => {
            bgPill.style.transition = `transform 0.6s ${EASE}`;
            bgPill.style.transform = 'scale(1)';

            staticLogo.style.transition = `opacity 0.45s ease-out, transform 0.45s ${EASE}`;
            staticLogo.style.opacity = '1';
            staticLogo.style.transform = 'scale(1)';

            // Phase 2 (0.65s - 1.35s): Left-to-Right Horizontal Expansion of Pill
            setTimeout(() => {
                const navRectFinal = navbarCapsule.getBoundingClientRect();
                bgPill.style.transition = `width 0.7s ${EASE}`;
                bgPill.style.width = `${navRectFinal.width}px`;

                // Phase 3 (0.95s): Staggered Sequential Reveal of Navbar Items
                setTimeout(() => {
                    navItems.forEach((item, idx) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translate3d(0, 0, 0)';
                        }, idx * 75);
                    });

                    // Phase 4 (1.6s - 2.35s): Seamless Overlay Fade-Out & Cleanup
                    setTimeout(() => {
                        overlay.style.opacity = '0';
                        setTimeout(() => {
                            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                            // Reset inline styles on navbar items to restore normal CSS hovers
                            navItems.forEach(item => {
                                item.style.opacity = '';
                                item.style.transform = '';
                                item.style.transition = '';
                            });
                        }, 750);
                    }, 650);
                }, 300);
            }, 600);
        }, 50);
    }

    function init() {
        if (document.getElementById('navbar-capsule')) {
            runSequence();
        } else {
            document.body.addEventListener('htmx:afterSwap', function (evt) {
                if (evt.detail.target.id === 'navbar-container' || document.getElementById('navbar-capsule')) {
                    runSequence();
                }
            }, { once: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();






