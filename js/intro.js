/**
 * PHILX Solutions — 2026 Viewport Center Intro Logo Morph Animation
 * Smooth FLIP transform from viewport center into the sticky navbar anchor.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        // Prevent double execution
        if (window.PHILX_INTRO_RUNNING) return;
        window.PHILX_INTRO_RUNNING = true;

        // Render Intro Overlay dynamically
        const overlay = document.createElement('div');
        overlay.id = 'intro-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:#000000;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;transition:opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);';
        
        overlay.innerHTML = `
            <div id="intro-logo-box" class="flex items-center space-x-4 transition-transform duration-700 ease-out">
                <img src="assets/logo-mark-white.png" alt="PHILX Intro Logo" class="h-16 w-auto rounded-xl shadow-2xl">
                <div class="flex flex-col justify-center w-[120px]">
                    <div class="flex justify-between font-black text-white leading-none text-[22px] uppercase tracking-widest">
                        <span>P</span><span>H</span><span>I</span><span>L</span><span>X</span>
                    </div>
                    <div class="flex justify-between text-[13px] font-bold text-zinc-400 leading-none mt-1.5 uppercase tracking-widest">
                        <span>S</span><span>O</span><span>L</span><span>U</span><span>T</span><span>I</span><span>O</span><span>N</span><span>S</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        function triggerIntroMorph() {
            const navbarCapsule = document.getElementById('navbar-capsule');
            const targetLogoAnchor = navbarCapsule ? navbarCapsule.querySelector('a[href="#"]') : null;
            const introBox = document.getElementById('intro-logo-box');

            if (!navbarCapsule || !targetLogoAnchor || !introBox) {
                // Fallback fade out
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 750);
                }, 400);
                return;
            }

            // Calculate FLIP animation offsets
            const introRect = introBox.getBoundingClientRect();
            const targetRect = targetLogoAnchor.getBoundingClientRect();

            const introCenterX = introRect.left + introRect.width / 2;
            const introCenterY = introRect.top + introRect.height / 2;

            const targetCenterX = targetRect.left + targetRect.width / 2;
            const targetCenterY = targetRect.top + targetRect.height / 2;

            const deltaX = targetCenterX - introCenterX;
            const deltaY = targetCenterY - introCenterY;
            const scale = targetRect.height / introRect.height;

            // Apply smooth FLIP 3D transform animation to center logo
            setTimeout(() => {
                introBox.style.transition = 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out';
                introBox.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`;
                introBox.style.opacity = '0.9';

                // Fade out overlay background
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        overlay.remove();
                    }, 750);
                }, 450);
            }, 300);
        }

        // Trigger morph sequence when HTMX navbar has loaded or window is ready
        if (document.getElementById('navbar-capsule')) {
            setTimeout(triggerIntroMorph, 150);
        } else {
            document.body.addEventListener('htmx:afterSwap', function (evt) {
                if (evt.detail.target.id === 'navbar-container' || document.getElementById('navbar-capsule')) {
                    setTimeout(triggerIntroMorph, 150);
                }
            }, { once: true });
        }
    });
})();
