(function() {
    'use strict';
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let forwardBlobs = [];
    let reverseBlobs = [];

    function updateBlobs() {
        forwardBlobs = document.querySelectorAll('.blob-forward');
        reverseBlobs = document.querySelectorAll('.blob-reverse');
    }

    document.addEventListener('mousemove', (e) => {
        // Dramatically increased multiplier for highly visible cursor interaction
        targetX = (e.clientX / window.innerWidth - 0.5) * 400; 
        targetY = (e.clientY / window.innerHeight - 0.5) * 400;
    });

    function render() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        forwardBlobs.forEach(el => {
            el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        });
        
        reverseBlobs.forEach(el => {
            el.style.transform = `translate3d(${-currentX}px, ${-currentY}px, 0)`;
        });

        requestAnimationFrame(render);
    }
    
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
