/**
 * PHILX Solutions — 2026 Intro Keyframe Sequence & Stable Layout Morph
 * ARCHITECTURE:
 *   - Independent Background Capsule & Static Logo Layer separation.
 *   - Logo is relocated to its exact final destination coordinates before pill expansion.
 *   - Keyframe sequence morphs background container horizontally without shifting logo layout box.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        if (window.PHILX_INTRO_RUNNING) return;
        window.PHILX_INTRO_RUNNING = true;

        const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

        // 1. Inject Keyframe CSS for Background Expansion
        const style = document.createElement('style');
        style.id = 'intro-keyframes-style';
        style.textContent = `
            @keyframes introPillExpand {
                from {
                    width: var(--pill-start-width);
                }
                to {
                    width: var(--pill-target-width);
                }
            }
        `;
        document.head.appendChild(style);

        // 2. Create Overlay Container
        const overlay = document.createElement('div');
        overlay.id = 'intro-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:99999;pointer-events:none;transition:opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);';

        // 3. Create Independent Background Capsule and Logo Layer
        overlay.innerHTML = `
            <div id="intro-bg-capsule" style="position:fixed;top:50%;left:50%;width:180px;height:180px;margin-top:-90px;margin-left:-90px;border-radius:9999px;background:#ffffff;box-shadow:0 25px 60px -15px rgba(0,0,0,0.6);transform:scale(0);transform-origin:center center;will-change:transform, top, left, width, height;overflow:hidden;z-index:1;"></div>
            
            <div id="intro-logo-layer" style="position:fixed;z-index:2;pointer-events:none;display:flex;align-items:center;will-change:top, left, opacity, transform;opacity:0;">
                <div style="display:flex;align-items:center;" class="space-x-3">
                    <div style="width:36px;height:36px;position:relative;flex-shrink:0;">
                        <img src="assets/logo-mark-black.png" alt="PHILX Logo" style="width:36px;height:36px;object-fit:contain;border-radius:8px;display:block;">
                    </div>
                    <div style="display:flex;flex-direction:column;justify-content:center;width:72px;flex-shrink:0;">
                        <div style="display:flex;justify-content:space-between;font-weight:900;color:#09090b;line-height:1;font-size:13px;text-transform:uppercase;letter-spacing:0;">
                            <span>P</span><span>H</span><span>I</span><span>L</span><span>X</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:9px;font-weight:700;color:#64748b;line-height:1;margin-top:4px;text-transform:uppercase;letter-spacing:0;">
                            <span>S</span><span>O</span><span>L</span><span>U</span><span>T</span><span>I</span><span>O</span><span>N</span><span>S</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        function runSequence() {
            const capsule = document.getElementById('intro-bg-capsule');
            const logoLayer = document.getElementById('intro-logo-layer');
            const navbarCapsule = document.getElementById('navbar-capsule');

            if (!capsule || !logoLayer || !navbarCapsule) {
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                        if (style.parentNode) style.parentNode.removeChild(style);
                    }, 750);
                }, 400);
                return;
            }

            const navbarLogo = navbarCapsule.querySelector('a');
            const navRect = navbarCapsule.getBoundingClientRect();
            const logoRect = navbarLogo ? navbarLogo.getBoundingClientRect() : null;

            const targetLogoWidth = logoRect ? logoRect.width : 120;
            const targetLogoHeight = logoRect ? logoRect.height : 36;

            const screenCenterX = window.innerWidth / 2;
            const screenCenterY = window.innerHeight / 2;

            // Initial center coordinates for static logo layer
            logoLayer.style.top = `${screenCenterY - targetLogoHeight / 2}px`;
            logoLayer.style.left = `${screenCenterX - targetLogoWidth / 2}px`;
            logoLayer.style.transform = 'scale(0.85)';

            // Phase 1 (0.05s - 0.75s): Centered White Circle & Logo Reveal
            setTimeout(() => {
                capsule.style.transition = `transform 0.7s ${EASE}`;
                capsule.style.transform = 'scale(1)';

                logoLayer.style.transition = `opacity 0.45s ease-out, transform 0.6s ${EASE}`;
                logoLayer.style.opacity = '1';
                logoLayer.style.transform = 'scale(1)';

                // Phase 2 (0.75s - 1.35s): Relocate Logo to Destination & Dock Capsule Circle/Pill to Navbar Left
                setTimeout(() => {
                    const currentNavRect = navbarCapsule.getBoundingClientRect();
                    const currentLogoRect = navbarLogo ? navbarLogo.getBoundingClientRect() : null;

                    const finalLogoTop = currentLogoRect ? currentLogoRect.top : (currentNavRect.top + (currentNavRect.height - 36) / 2);
                    const finalLogoLeft = currentLogoRect ? currentLogoRect.left : (currentNavRect.left + 24);
                    const logoWidth = currentLogoRect ? currentLogoRect.width : 120;
                    const paddingLeft = Math.max(16, finalLogoLeft - currentNavRect.left);

                    // Calculate initial pill width enclosing the logo completely without text overflow
                    const initialPillWidth = Math.max(currentNavRect.height, paddingLeft + logoWidth + paddingLeft);

                    // 1. Move logo layer directly to exact navbar destination coordinates
                    logoLayer.style.transition = `top 0.6s ${EASE}, left 0.6s ${EASE}`;
                    logoLayer.style.top = `${finalLogoTop}px`;
                    logoLayer.style.left = `${finalLogoLeft}px`;

                    // 2. Move background capsule to navbar left as a matching initial pill containing the logo
                    capsule.style.transition = `top 0.6s ${EASE}, left 0.6s ${EASE}, margin 0.6s ${EASE}, width 0.6s ${EASE}, height 0.6s ${EASE}, border-radius 0.6s ${EASE}`;
                    capsule.style.top = `${currentNavRect.top}px`;
                    capsule.style.left = `${currentNavRect.left}px`;
                    capsule.style.marginTop = '0px';
                    capsule.style.marginLeft = '0px';
                    capsule.style.width = `${initialPillWidth}px`;
                    capsule.style.height = `${currentNavRect.height}px`;
                    capsule.style.borderRadius = '9999px';

                    // Phase 3 (1.35s - 1.95s): Horizontal Pill Expansion (Circle-to-Pill Reveal via Keyframe Sequence)
                    setTimeout(() => {
                        const navRectFinal = navbarCapsule.getBoundingClientRect();

                        // Keyframe sequence for horizontal expansion of background container
                        capsule.style.setProperty('--pill-start-width', `${initialPillWidth}px`);
                        capsule.style.setProperty('--pill-target-width', `${navRectFinal.width}px`);
                        capsule.style.animation = `introPillExpand 0.6s ${EASE} forwards`;

                        // Logo is 100% static & frozen at its destination coordinates during background reveal.

                        // Phase 4 (1.95s - 2.7s): Handover & Fade Out
                        setTimeout(() => {
                            overlay.style.opacity = '0';
                            setTimeout(() => {
                                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                                if (style.parentNode) style.parentNode.removeChild(style);
                            }, 750);
                        }, 600);
                    }, 600);
                }, 700);
            }, 50);
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


