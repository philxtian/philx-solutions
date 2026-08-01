/**
 * PHILX Solutions — 2026 Multi-Stage Luxury Intro Sequence
 * ARCHITECTURE: Anchored Logo Coordinates & Independent Pill Expansion.
 *   - Logo is pinned at its exact target location on the left side of the container.
 *   - Container width expands left-to-right without shifting logo transform origin off-axis.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        if (window.PHILX_INTRO_RUNNING) return;
        window.PHILX_INTRO_RUNNING = true;

        const EASE = 'cubic-bezier(0.16,1,0.3,1)';

        // Overlay Container
        const overlay = document.createElement('div');
        overlay.id = 'intro-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:99999;pointer-events:none;transition:opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);';

        // Expanded White Circle Container
        overlay.innerHTML = `
            <div id="intro-morph-capsule" style="position:fixed;top:50%;left:50%;width:180px;height:180px;margin-top:-90px;margin-left:-90px;border-radius:9999px;background:#ffffff;box-shadow:0 25px 60px -15px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;transform:scale(0);transform-origin:center center;transition:transform 0.8s ${EASE}, top 0.65s ${EASE}, left 0.65s ${EASE}, margin 0.65s ${EASE}, width 0.65s ${EASE}, height 0.65s ${EASE}, padding 0.65s ${EASE}, border-radius 0.65s ${EASE};will-change:transform, top, left, width, height;overflow:hidden;">
                <div id="intro-logo-wrapper" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);transition:left 0.65s ${EASE}, transform 0.65s ${EASE};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <div id="intro-logo-content" style="opacity:0;transform:scale(0.85);transition:opacity 0.45s ease-out, transform 0.45s ${EASE};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                        <img src="assets/logo-mark-black.png" alt="PHILX Logo" style="height:38px;width:auto;border-radius:8px;flex-shrink:0;">
                        <div style="display:flex;flex-direction:column;justify-content:center;width:72px;margin-left:12px;flex-shrink:0;">
                            <div style="display:flex;justify-content:space-between;font-weight:900;color:#000000;line-height:1;font-size:13px;text-transform:uppercase;">
                                <span>P</span><span>H</span><span>I</span><span>L</span><span>X</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:700;color:#64748b;line-height:1;margin-top:4px;text-transform:uppercase;">
                                <span>S</span><span>O</span><span>L</span><span>U</span><span>T</span><span>I</span><span>O</span><span>N</span><span>S</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        function runSequence() {
            const capsule = document.getElementById('intro-morph-capsule');
            const logoWrapper = document.getElementById('intro-logo-wrapper');
            const logoContent = document.getElementById('intro-logo-content');
            const navbarCapsule = document.getElementById('navbar-capsule');

            if (!capsule || !logoWrapper || !logoContent || !navbarCapsule) {
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 750);
                }, 400);
                return;
            }

            // Phase 1 (0.0s - 0.8s): Centered White Circle Reveal
            setTimeout(() => {
                capsule.style.transform = 'scale(1)';

                // Phase 2 (0.8s - 1.4s): Crisp Logo Fade & Relocate directly to top navbar bounding rect
                setTimeout(() => {
                    logoContent.style.opacity = '1';
                    logoContent.style.transform = 'scale(1)';

                    setTimeout(() => {
                        const targetNavbarRect = navbarCapsule.getBoundingClientRect();

                        // Dock capsule top, left, and height directly to top sticky navbar position
                        capsule.style.top = `${targetNavbarRect.top}px`;
                        capsule.style.left = `${targetNavbarRect.left}px`;
                        capsule.style.marginTop = '0px';
                        capsule.style.marginLeft = '0px';
                        capsule.style.height = `${targetNavbarRect.height}px`;

                        // Lock logo wrapper position to the left side of the capsule (24px left offset)
                        logoWrapper.style.left = '24px';
                        logoWrapper.style.transform = 'translate(0, -50%)';

                        // Phase 3 (1.4s - 2.0s): Left-to-Right Pill Morph Width Expansion
                        setTimeout(() => {
                            capsule.style.width = `${targetNavbarRect.width}px`;

                            // Phase 4 (2.0s - 2.2s): Settle & Sticky Navbar Handover
                            setTimeout(() => {
                                overlay.style.opacity = '0';
                                setTimeout(() => {
                                    overlay.remove();
                                }, 750);
                            }, 450);
                        }, 550);
                    }, 350);
                }, 350);
            }, 100);
        }

        if (document.getElementById('navbar-capsule')) {
            runSequence();
        } else {
            document.body.addEventListener('htmx:afterSwap', function (evt) {
                if (evt.detail.target.id === 'navbar-container' || document.getElementById('navbar-capsule')) {
                    runSequence();
                }
            }, { once: true });
        }
    });
})();
