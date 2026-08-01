/**
 * PHILX Solutions — 2026 Elite Interactive Portfolio Intro Sequence
 * 3-Phase Morph: Organic Center Expansion -> Dark Logo Reveal -> Fluid Circle-to-Pill Morph
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        if (window.PHILX_INTRO_RUNNING) return;
        window.PHILX_INTRO_RUNNING = true;

        // Overlay Container
        const overlay = document.createElement('div');
        overlay.id = 'intro-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:99999;display:flex;align-items:center;justify-content:center;pointer-events:none;transition:opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);';

        // Initial Circle Element
        overlay.innerHTML = `
            <div id="intro-morph-capsule" style="width:130px;height:130px;border-radius:9999px;background:#ffffff;box-shadow:0 25px 60px -15px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;transform:scale(0);transition:transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), width 0.85s cubic-bezier(0.16, 1, 0.3, 1), height 0.85s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.85s cubic-bezier(0.16, 1, 0.3, 1);will-change:transform, width, height;overflow:hidden;position:relative;">
                <div id="intro-logo-content" style="opacity:0;transform:scale(0.85);transition:opacity 0.45s ease-out, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);display:flex;align-items:center;flex-shrink:0;">
                    <img src="assets/logo-mark-black.png" alt="PHILX Logo" style="height:36px;width:auto;border-radius:8px;">
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
        `;
        document.body.appendChild(overlay);

        function runSequence() {
            const capsule = document.getElementById('intro-morph-capsule');
            const logoContent = document.getElementById('intro-logo-content');
            const navbarCapsule = document.getElementById('navbar-capsule');

            if (!capsule || !logoContent || !navbarCapsule) {
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 750);
                }, 400);
                return;
            }

            // Phase 1: Organic Center Circle Expansion
            setTimeout(() => {
                capsule.style.transform = 'scale(1)';

                // Phase 2: Crisp Dark Logo Reveal Inside Circle
                setTimeout(() => {
                    logoContent.style.opacity = '1';
                    logoContent.style.transform = 'scale(1)';

                    // Phase 3: Fluid Circle-to-Pill Transformation & Docking
                    setTimeout(() => {
                        const targetRect = navbarCapsule.getBoundingClientRect();
                        const capsuleRect = capsule.getBoundingClientRect();

                        const capsuleCenterX = capsuleRect.left + capsuleRect.width / 2;
                        const capsuleCenterY = capsuleRect.top + capsuleRect.height / 2;

                        const targetCenterX = targetRect.left + targetRect.width / 2;
                        const targetCenterY = targetRect.top + targetRect.height / 2;

                        const deltaX = targetCenterX - capsuleCenterX;
                        const deltaY = targetCenterY - capsuleCenterY;

                        // Fluid Morph: Stretch width & height to match navbar capsule while translating to top
                        capsule.style.transition = 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), width 0.85s cubic-bezier(0.16, 1, 0.3, 1), height 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out';
                        capsule.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
                        capsule.style.width = `${targetRect.width}px`;
                        capsule.style.height = `${targetRect.height}px`;

                        // Phase 4: Seamless handover to sticky navbar & overlay dissolve
                        setTimeout(() => {
                            overlay.style.opacity = '0';
                            setTimeout(() => {
                                overlay.remove();
                            }, 750);
                        }, 450);
                    }, 550);
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
