(function() {
    'use strict';
    
    function init3DTilt() {
        const cards = document.querySelectorAll('.group.relative:not(form):not(.no-tilt)');
        
        cards.forEach(card => {
            if (card.dataset.tiltBound === 'true') return;
            if (card.querySelector('form') || card.classList.contains('no-tilt')) return;
            card.dataset.tiltBound = 'true';
            
            // Ensure parent container has perspective for 3D depth
            card.style.transformStyle = 'preserve-3d';
            card.style.perspective = '1000px';
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within card
                const y = e.clientY - rect.top;  // y position within card
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation angle (max 10 degrees for smooth playfulness)
                const rotateX = -((y - centerY) / centerY) * 10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                // Apply transform with a slight scale-up on hover
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // Update internal glare/spotlight position if present
                const glare = card.querySelector('.card-spotlight');
                if (glare) {
                    glare.style.setProperty('--mouse-x', `${x}px`);
                    glare.style.setProperty('--mouse-y', `${y}px`);
                }
            });
            
            card.addEventListener('mouseleave', () => {
                // Smooth spring-back reset when cursor leaves
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            });
            
            card.addEventListener('mouseenter', () => {
                // Remove transition during active movement to eliminate lag
                card.style.transition = 'none';
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init3DTilt);
    } else {
        init3DTilt();
    }
    
    document.body.addEventListener('htmx:afterSwap', init3DTilt);
})();
