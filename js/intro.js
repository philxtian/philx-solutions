/**
 * PHILX Solutions — Center-to-Left Pill Reveal & Staggered Nav
 */
(function () {
    'use strict';

    // Execution Guard: Prevent duplicate instances
    if (window.PHILX_INTRO_ACTIVE) return;
    window.PHILX_INTRO_ACTIVE = true;

    const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

    // 1. Create Fullscreen Pure Black Overlay
    const overlay = document.createElement('div');
    overlay.id = 'intro-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:99999;pointer-events:none;transition:opacity 0.75s ease;';

    // 2. Create Elements (Starting Centered)
    overlay.innerHTML = `
        <div id="intro-bg-pill" style="position:fixed;top:50%;left:50%;transform:translate(-50%, -50%) scale(0);background:#ffffff;border-radius:9999px;z-index:1;will-change:top, left, width, height, transform; transition: transform 0.5s ${EASE}, top 0.6s ${EASE}, left 0.6s ${EASE}, width 0.6s ${EASE}, height 0.6s ${EASE};"></div>
        
        <div id="intro-static-logo" style="position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);z-index:2;opacity:0;transition: opacity 0.4s ease, top 0.6s ${EASE}, left 0.6s ${EASE}, transform 0.6s ${EASE}; display:flex;align-items:center;">
            <div style="display:flex;align-items:center;" class="space-x-3">
                <img src="assets/logo-mark-black.png" alt="PHILX Logo" style="width:36px;height:36px;object-fit:contain;border-radius:8px;display:block;">
                <div style="display:flex;flex-direction:column;justify-content:center;width:72px;">
                    <div style="display:flex;justify-content:space-between;font-weight:900;color:#000000;line-height:1;font-size:13px;text-transform:uppercase;">
                        <span>P</span><span>H</span><span>I</span><span>L</span><span>X</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:700;color:#64748b;line-height:1;margin-top:4px;text-transform:uppercase;">
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

    if (document.body) mountOverlay();
    else document.addEventListener('DOMContentLoaded', mountOverlay);

    function runSequence() {
        mountOverlay();
        const bgPill = document.getElementById('intro-bg-pill');
        const staticLogo = document.getElementById('intro-static-logo');
        const navbarCapsule = document.getElementById('navbar-capsule');

        if (!bgPill || !staticLogo || !navbarCapsule) {
            overlay.style.opacity = '0';
            return;
        }

        const navRect = navbarCapsule.getBoundingClientRect();
        const navItems = navbarCapsule.querySelectorAll('.nav-link, .nav-cta, .nav-mobile-btn');

        // Hide nav items for staggered reveal later
        navItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            item.style.transition = `opacity 0.4s ${EASE}, transform 0.4s ${EASE}`;
        });

        // Hardcoded fixed circle size for initial centered splash (avoids unrendered DOM height bugs)
        const CIRCLE_SIZE = 80;
        bgPill.style.width = `${CIRCLE_SIZE}px`;
        bgPill.style.height = `${CIRCLE_SIZE}px`;

        // Phase 1: Reveal circle and logo dead center
        setTimeout(() => {
            bgPill.style.transform = 'translate(-50%, -50%) scale(1)';
            staticLogo.style.opacity = '1';

            // Phase 2: Move circle and logo to the left side (navbar position)
            setTimeout(() => {
                const actualNavHeight = (navRect.height > 0 && navRect.height < 200) ? navRect.height : 64;
                const targetTop = navRect.top + (actualNavHeight / 2);
                const targetLeftPill = navRect.left + (CIRCLE_SIZE / 2);
                const targetLeftLogo = navRect.left + 24; // Align with left padding

                bgPill.style.top = `${targetTop}px`;
                bgPill.style.left = `${targetLeftPill}px`;

                staticLogo.style.top = `${targetTop}px`;
                staticLogo.style.left = `${targetLeftLogo}px`;
                staticLogo.style.transform = 'translate(0, -50%)'; // Shift transform origin to left edge

                // Phase 3: Expand pill width and morph height seamlessly to fill navbar
                setTimeout(() => {
                    bgPill.style.transform = 'translate(0, -50%) scale(1)';
                    bgPill.style.left = `${navRect.left}px`;
                    bgPill.style.width = `${navRect.width}px`;
                    bgPill.style.height = `${actualNavHeight}px`;

                    // Phase 4: Staggered sequential reveal of Navigation Items
                    setTimeout(() => {
                        navItems.forEach((item, idx) => {
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, idx * 75); // 75ms delay between each item
                        });

                        // Phase 5: Fade out the black overlay and clean up the DOM
                        setTimeout(() => {
                            overlay.style.opacity = '0';
                            setTimeout(() => {
                                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                                // Clean up inline styles so CSS hover states work normally
                                navItems.forEach(item => {
                                    item.style.opacity = '';
                                    item.style.transform = '';
                                    item.style.transition = '';
                                });
                            }, 750);
                        }, 650);

                    }, 400); // Trigger nav reveal slightly before pill expansion finishes

                }, 600); // Wait for the left-move animation to finish

            }, 800); // Hold center position briefly before moving
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