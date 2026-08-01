/**
 * PHILX Solutions — 2026 Luxury Circle-to-Pill Morph Intro Sequence
 * ARCHITECTURE:
 *   - Strict SessionStorage Lock: Plays strictly ONCE per session.
 *   - Monochromatic Aesthetics: Pure Black (#000000) & Pure White (#FFFFFF) only.
 *   - Morph Transition: Centered white circle with black logo smoothly glides & expands into top sticky navbar pill.
 */

(function () {
    'use strict';

    const INTRO_SESSION_KEY = 'philx_intro_seen';

    // 1. Session Guard: Abort immediately if already played in this session
    if (sessionStorage.getItem(INTRO_SESSION_KEY) === 'true') {
        return;
    }

    // 2. Execution Guard: Prevent duplicate instances
    if (window.PHILX_INTRO_ACTIVE) return;
    window.PHILX_INTRO_ACTIVE = true;

    // Lock session state immediately
    sessionStorage.setItem(INTRO_SESSION_KEY, 'true');

    const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

    // 3. Create Fullscreen Monochromatic Overlay
    const overlay = document.createElement('div');
    overlay.id = 'intro-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:99999;pointer-events:none;transition:opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);';

    // 4. Create Centered Morphing Pill & Logo Elements
    overlay.innerHTML = `
        <div id="intro-morph-pill" style="position:fixed;top:50%;left:50%;width:140px;height:140px;margin-top:-70px;margin-left:-70px;border-radius:9999px;background:#ffffff;box-shadow:0 25px 60px -15px rgba(0,0,0,0.6);transform:scale(0);transform-origin:center center;transition:transform 0.65s ${EASE}, top 0.75s ${EASE}, left 0.75s ${EASE}, margin 0.75s ${EASE}, width 0.75s ${EASE}, height 0.75s ${EASE}, border-radius 0.75s ${EASE};will-change:transform, top, left, width, height;z-index:1;overflow:hidden;"></div>
        
        <div id="intro-morph-logo" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.85);opacity:0;transition:opacity 0.45s ease-out, transform 0.65s ${EASE}, top 0.75s ${EASE}, left 0.75s ${EASE};will-change:opacity, transform, top, left;z-index:2;pointer-events:none;display:flex;align-items:center;">
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

    // Mount pure black screen immediately
    if (document.body) {
        mountOverlay();
    } else {
        document.addEventListener('DOMContentLoaded', mountOverlay);
    }

    function runSequence() {
        mountOverlay();

        const pill = document.getElementById('intro-morph-pill');
        const logo = document.getElementById('intro-morph-logo');
        const navbarCapsule = document.getElementById('navbar-capsule');

        if (!pill || !logo || !navbarCapsule) {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                }, 750);
            }, 400);
            return;
        }

        // Phase 1 (0.05s - 0.75s): Centered White Circle Reveal & Logo Fade-In
        setTimeout(() => {
            pill.style.transform = 'scale(1)';
            logo.style.opacity = '1';
            logo.style.transform = 'translate(-50%, -50%) scale(1)';

            // Phase 2 (0.75s - 1.5s): Direct Circle-to-Pill Morph to Sticky Navbar
            setTimeout(() => {
                const navbarLogo = navbarCapsule.querySelector('a');
                const navRect = navbarCapsule.getBoundingClientRect();
                const logoRect = navbarLogo ? navbarLogo.getBoundingClientRect() : null;

                const targetLogoTop = logoRect ? logoRect.top : (navRect.top + (navRect.height - 36) / 2);
                const targetLogoLeft = logoRect ? logoRect.left : (navRect.left + 24);

                // Morph Pill Container directly into navbar bounding box
                pill.style.top = `${navRect.top}px`;
                pill.style.left = `${navRect.left}px`;
                pill.style.marginTop = '0px';
                pill.style.marginLeft = '0px';
                pill.style.width = `${navRect.width}px`;
                pill.style.height = `${navRect.height}px`;
                pill.style.borderRadius = '9999px';

                // Morph Logo directly into navbar logo coordinates
                logo.style.top = `${targetLogoTop}px`;
                logo.style.left = `${targetLogoLeft}px`;
                logo.style.transform = 'translate(0, 0) scale(1)';

                // Phase 3 (1.5s - 2.25s): Seamless Handover & Fade Out
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                    }, 750);
                }, 750);
            }, 700);
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





