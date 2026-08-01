/**
 * PHILX Solutions — 2026 Static Logo Keyframe Intro Architecture
 * ARCHITECTURE:
 *   - Logo element is anchored at its EXACT final navbar coordinates from frame ONE.
 *   - Dedicated absolute background overlay handles the circle-to-pill horizontal expansion beneath it.
 *   - Zero layout shifts, zero flex changes, and zero horizontal movement on the logo container.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        if (window.PHILX_INTRO_RUNNING) return;
        window.PHILX_INTRO_RUNNING = true;

        const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

        // 1. Keyframe CSS Injection for Dedicated Background Expansion
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

        // 2. Create Intro Overlay Layer
        const overlay = document.createElement('div');
        overlay.id = 'intro-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:99999;pointer-events:none;transition:opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);';

        // 3. Create Dedicated Background Capsule & Static Logo Container
        overlay.innerHTML = `
            <div id="intro-bg-capsule" style="position:fixed;background:#ffffff;box-shadow:0 25px 60px -15px rgba(0,0,0,0.6);border-radius:9999px;z-index:1;will-change:width, transform, opacity;overflow:hidden;"></div>
            
            <div id="intro-logo-layer" style="position:fixed;z-index:2;pointer-events:none;display:flex;align-items:center;will-change:opacity, transform;opacity:0;">
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

            // Measure exact final navbar coordinates
            const navbarLogo = navbarCapsule.querySelector('a');
            const navRect = navbarCapsule.getBoundingClientRect();
            const logoRect = navbarLogo ? navbarLogo.getBoundingClientRect() : null;

            const finalLogoTop = logoRect ? logoRect.top : (navRect.top + (navRect.height - 36) / 2);
            const finalLogoLeft = logoRect ? logoRect.left : (navRect.left + 24);
            const logoWidth = logoRect ? logoRect.width : 120;
            const paddingLeft = Math.max(16, finalLogoLeft - navRect.left);

            const initialPillWidth = Math.max(navRect.height, paddingLeft + logoWidth + paddingLeft);

            // Frame 1: Anchor Logo Layer at its exact final navbar coordinates immediately
            logoLayer.style.top = `${finalLogoTop}px`;
            logoLayer.style.left = `${finalLogoLeft}px`;
            logoLayer.style.transform = 'scale(0.9)';

            // Frame 1: Position dedicated background shape underneath at navbar left
            capsule.style.top = `${navRect.top}px`;
            capsule.style.left = `${navRect.left}px`;
            capsule.style.height = `${navRect.height}px`;
            capsule.style.width = `${initialPillWidth}px`;
            capsule.style.transform = 'scale(0)';
            capsule.style.transformOrigin = `${finalLogoLeft - navRect.left + 18}px center`;

            // Phase 1 (0.05s - 0.75s): Dedicated Circle/Pill Reveal & Crisp Logo Fade-In at Fixed Coordinates
            setTimeout(() => {
                capsule.style.transition = `transform 0.65s ${EASE}`;
                capsule.style.transform = 'scale(1)';

                logoLayer.style.transition = `opacity 0.5s ease-out, transform 0.5s ${EASE}`;
                logoLayer.style.opacity = '1';
                logoLayer.style.transform = 'scale(1)';

                // Phase 2 (0.75s - 1.45s): Circle-to-Pill Horizontal Reveal via Keyframe Animation
                setTimeout(() => {
                    const navRectFinal = navbarCapsule.getBoundingClientRect();

                    capsule.style.setProperty('--pill-start-width', `${initialPillWidth}px`);
                    capsule.style.setProperty('--pill-target-width', `${navRectFinal.width}px`);
                    capsule.style.animation = `introPillExpand 0.7s ${EASE} forwards`;

                    // Logo remains 100% frozen & static at (finalLogoTop, finalLogoLeft) throughout expansion.

                    // Phase 3 (1.45s - 2.2s): Seamless Sticky Navbar Handover & Cleanup
                    setTimeout(() => {
                        overlay.style.opacity = '0';
                        setTimeout(() => {
                            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                            if (style.parentNode) style.parentNode.removeChild(style);
                        }, 750);
                    }, 700);
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



