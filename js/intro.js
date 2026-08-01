/**
 * PHILX Solutions — 2026 Multi-Stage Luxury Intro Sequence
 * Precise Viewport Coordinate Alignment & Left-to-Right Pill Morph
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        if (window.PHILX_INTRO_RUNNING) return;
        window.PHILX_INTRO_RUNNING = true;

        // Overlay Container
        const overlay = document.createElement('div');
        overlay.id = 'intro-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:99999;pointer-events:none;transition:opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);';

        // Initial Circle Element (Fixed at Screen Center)
        overlay.innerHTML = `
            <div id="intro-morph-capsule" style="position:fixed;top:50%;left:50%;width:140px;height:140px;margin-top:-70px;margin-left:-70px;border-radius:9999px;background:#ffffff;box-shadow:0 25px 60px -15px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:flex-start;padding-left:20px;transform:scale(0);transition:transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), top 0.65s cubic-bezier(0.16, 1, 0.3, 1), left 0.65s cubic-bezier(0.16, 1, 0.3, 1), margin 0.65s cubic-bezier(0.16, 1, 0.3, 1), width 0.65s cubic-bezier(0.16, 1, 0.3, 1), height 0.65s cubic-bezier(0.16, 1, 0.3, 1);will-change:transform, top, left, width, height;overflow:hidden;">
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

            // Phase 1 (0.0s - 0.8s): Deliberate Center Circle Reveal
            setTimeout(() => {
                capsule.style.transform = 'scale(1)';

                // Phase 2 (0.8s - 1.4s): Logo Entry & Left Relocation to Navbar Left Anchor
                setTimeout(() => {
                    logoContent.style.opacity = '1';
                    logoContent.style.transform = 'scale(1)';

                    setTimeout(() => {
                        const targetNavbarRect = navbarCapsule.getBoundingClientRect();

                        // Relocate top/left from screen center directly to navbar bounding rect
                        capsule.style.top = `${targetNavbarRect.top}px`;
                        capsule.style.left = `${targetNavbarRect.left}px`;
                        capsule.style.marginTop = '0px';
                        capsule.style.marginLeft = '0px';

                        // Phase 3 (1.4s - 2.0s): Left-to-Right Horizontal Expansion
                        setTimeout(() => {
                            capsule.style.width = `${targetNavbarRect.width}px`;
                            capsule.style.height = `${targetNavbarRect.height}px`;

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
