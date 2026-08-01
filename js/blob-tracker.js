(function() {
    'use strict';
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let forwardBlobs = [];
    let reverseBlobs = [];

    // Cache the DOM elements so we aren't querying the document every single frame
    function updateBlobs() {
        forwardBlobs = document.querySelectorAll('.blob-forward');
        reverseBlobs = document.querySelectorAll('.blob-reverse');
    }

    document.addEventListener('mousemove', (e) => {
        // Calculate offset percentage relative to center of screen
        targetX = (e.clientX / window.innerWidth - 0.5) * 120; 
        targetY = (e.clientY / window.innerHeight - 0.5) * 120;
    });

    function render() {
        // Liquid-smooth linear interpolation (lerp)
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        // Apply hardware-accelerated translations
        forwardBlobs.forEach(el => {
            el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        });
        
        reverseBlobs.forEach(el => {
            el.style.transform = `translate3d(${-currentX}px, ${-currentY}px, 0)`;
        });

        requestAnimationFrame(render);
    }
    
    // Initialize on first load and re-cache on HTMX swaps
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateBlobs();
            requestAnimationFrame(render);
        });
    } else {
        updateBlobs();
        requestAnimationFrame(render);
    }

    document.body.addEventListener('htmx:afterSwap', updateBlobs);
})();
