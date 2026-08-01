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

        // Hardcoded fixed circle size for initial centered splash (generous 150px size to comfortably fit full logo)
        const CIRCLE_SIZE = 150;
        bgPill.style.width = `${CIRCLE_SIZE}px`;
        bgPill.style.height = `${CIRCLE_SIZE}px`;

        // Phase 1: Reveal circle and logo dead center
        setTimeout(() => {
            bgPill.style.transform = 'translate(-50%, -50%) scale(1)';
            staticLogo.style.opacity = '1';

            // Phase 2: Move circle and logo to the left side (navbar position)
            setTimeout(() => {
                const navbarLogo = navbarCapsule.querySelector('a');
                const logoRect = navbarLogo ? navbarLogo.getBoundingClientRect() : null;
                const actualNavHeight = (navRect.height > 0 && navRect.height < 200) ? navRect.height : 64;
                const targetTop = navRect.top + (actualNavHeight / 2);
                const targetLeftPill = navRect.left + (CIRCLE_SIZE / 2);
                const targetLeftLogo = logoRect ? logoRect.left : (navRect.left + 24);

                bgPill.style.top = `${targetTop}px`;
                bgPill.style.left = `${targetLeftPill}px`;

                staticLogo.style.top = logoRect ? `${logoRect.top}px` : `${targetTop}px`;
                staticLogo.style.left = `${targetLeftLogo}px`;
                staticLogo.style.transform = logoRect ? 'translate(0, 0)' : 'translate(0, -50%)';

                // Phase 3: Expand pill width and morph height seamlessly to fill navbar bounding box
                setTimeout(() => {
                    const finalNavRect = navbarCapsule.getBoundingClientRect();
                    const finalLogo = navbarCapsule.querySelector('a');
                    const finalLogoRect = finalLogo ? finalLogo.getBoundingClientRect() : null;

                    bgPill.style.transform = 'translate(0, 0)';
                    bgPill.style.top = `${finalNavRect.top}px`;
                    bgPill.style.left = `${finalNavRect.left}px`;
                    bgPill.style.width = `${finalNavRect.width}px`;
                    bgPill.style.height = `${finalNavRect.height}px`;

                    if (finalLogoRect) {
                        staticLogo.style.transform = 'translate(0, 0)';
                        staticLogo.style.top = `${finalLogoRect.top}px`;
                        staticLogo.style.left = `${finalLogoRect.left}px`;
                    }

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