(function() {
    'use strict';
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        // Calculate offset percentage relative to center of screen, scaled to a 60px max travel distance
        targetX = (e.clientX / window.innerWidth - 0.5) * 120; 
        targetY = (e.clientY / window.innerHeight - 0.5) * 120;
    });

    function render() {
        // Linear interpolation (lerp) for liquid-smooth movement
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        // Move blobs in the same direction as the mouse
        document.querySelectorAll('.blob-forward').forEach(el => {
            el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        });
        
        // Move blobs in the opposite direction for parallax depth
        document.querySelectorAll('.blob-reverse').forEach(el => {
            el.style.transform = `translate3d(${-currentX}px, ${-currentY}px, 0)`;
        });

        requestAnimationFrame(render);
    }
    
    requestAnimationFrame(render);
})();
