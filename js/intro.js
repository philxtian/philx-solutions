/**
 * PHILX Solutions — 2026 Preceding Circle Reveal & Sticky Pill Morph Animation
 * 3-Phase Intro: Center Circle Expansion -> Dark Logo Reveal -> Pill Navbar Docking
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        if (window.PHILX_INTRO_RUNNING) return;
        window.PHILX_INTRO_RUNNING = true;

        // Create Intro Overlay Container
        const overlay = document.createElement('div');
        overlay.id = 'intro-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:99999;display:flex;align-items:center;justify-content:center;pointer-events:none;transition:opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);';

        // Preceding Circle + Dark Logo HTML
        overlay.innerHTML = `
            <div id="intro-circle" style="width:140px;height:140px;border-radius:9999px;background:#ffffff;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;transform:scale(0);transition:transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.6s cubic-bezier(0.16, 1, 0.3, 1), width 0.6s cubic-bezier(0.16, 1, 0.3, 1), height 0.6s cubic-bezier(0.16, 1, 0.3, 1);will-change:transform;">
                <div id="intro-logo-content" style="opacity:0;transform:scale(0.85);transition:opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);display:flex;align-items:center;space-x:12px;" class="px-5">
                    <img src="assets/logo-mark-black.png" alt="PHILX Logo" style="height:36px;width:auto;border-radius:8px;">
                    <div style="display:flex;flex-direction:column;justify-content:center;width:72px;margin-left:12px;">
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
        document.body.appendChild(overlay);

        function runSequence() {
            const circle = document.getElementById('intro-circle');
            const logoContent = document.getElementById('intro-logo-content');
            const navbarCapsule = document.getElementById('navbar-capsule');

            if (!circle || !logoContent || !navbarCapsule) {
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 750);
                }, 400);
                return;
            }

            // Phase 1: Circle Expands from scale(0) -> scale(1)
            setTimeout(() => {
                circle.style.transform = 'scale(1)';

                // Phase 2: Fade & Scale Dark Logo inside white circle
                setTimeout(() => {
                    logoContent.style.opacity = '1';
                    logoContent.style.transform = 'scale(1)';

                    // Phase 3: FLIP Morph White Circle into Sticky Pill Navbar Anchor Position
                    setTimeout(() => {
                        const targetAnchor = navbarCapsule.querySelector('a[href="#"]') || navbarCapsule;
                        const targetRect = targetAnchor.getBoundingClientRect();
                        const circleRect = circle.getBoundingClientRect();

                        const circleCenterX = circleRect.left + circleRect.width / 2;
                        const circleCenterY = circleRect.top + circleRect.height / 2;

                        const targetCenterX = targetRect.left + targetRect.width / 2;
                        const targetCenterY = targetRect.top + targetRect.height / 2;

                        const deltaX = targetCenterX - circleCenterX;
                        const deltaY = targetCenterY - circleCenterY;
                        const scale = targetRect.height / circleRect.height;

                        circle.style.transition = 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out';
                        circle.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`;

                        // Phase 4: Fade overlay background to reveal page content
                        setTimeout(() => {
                            overlay.style.opacity = '0';
                            setTimeout(() => {
                                overlay.remove();
                            }, 750);
                        }, 400);
                    }, 500);
                }, 300);
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
