(function() {
    'use strict';
    let targetX = 0, targetY = 0;
    let trackedBlobs = [];

    function updateBlobs() {
        const elements = document.querySelectorAll('.blob-forward, .blob-reverse, .blob-slow, .blob-medium, .blob-fast');
        trackedBlobs = Array.from(elements).map(el => {
            let lerpSpeed = 0.08;
            let weight = 1.0;
            let isReverse = el.classList.contains('blob-reverse');

            if (el.classList.contains('blob-slow')) {
                lerpSpeed = 0.04;
                weight = 0.7;
            } else if (el.classList.contains('blob-medium')) {
                lerpSpeed = 0.075;
                weight = 1.1;
            } else if (el.classList.contains('blob-fast')) {
                lerpSpeed = 0.13;
                weight = 1.6;
            }

            if (el.dataset.speed) lerpSpeed = parseFloat(el.dataset.speed);
            if (el.dataset.weight) weight = parseFloat(el.dataset.weight);

            if (isReverse && !el.dataset.weight) weight *= -1;

            return {
                el,
                cx: 0,
                cy: 0,
                lerpSpeed,
                weight
            };
        });
    }

    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 380; 
        targetY = (e.clientY / window.innerHeight - 0.5) * 380;
    });

    function render() {
        trackedBlobs.forEach(b => {
            const tx = targetX * b.weight;
            const ty = targetY * b.weight;
            b.cx += (tx - b.cx) * b.lerpSpeed;
            b.cy += (ty - b.cy) * b.lerpSpeed;
            b.el.style.transform = `translate3d(${b.cx.toFixed(2)}px, ${b.cy.toFixed(2)}px, 0)`;
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
