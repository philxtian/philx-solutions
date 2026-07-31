/**
 * PHILX Solutions — Antigravity Monochrome Interactive Canvas & Cursor Spotlight Background
 * Lightweight, 60fps cursor-reactive particle constellation & ambient spotlight animation.
 */

(function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-particles-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.85;transition:opacity 0.5s ease;';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Smooth cursor state with lerp
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    const particles = [];
    const MAX_PARTICLES = 65;
    const CONNECT_DISTANCE = 110;
    const MOUSE_RADIUS = 140;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        initParticles();
    }

    function Particle(x, y) {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.baseRadius = Math.random() * 1.5 + 1;
        this.radius = this.baseRadius;
    }

    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off screen boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Cursor attraction / gentle displacement
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.2;
            this.y -= Math.sin(angle) * force * 1.2;
            this.radius = this.baseRadius + force * 2;
        } else {
            this.radius += (this.baseRadius - this.radius) * 0.05;
        }
    };

    function initParticles() {
        particles.length = 0;
        const count = Math.min(Math.floor((width * height) / 18000), MAX_PARTICLES);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        // Smooth cursor lerping
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        ctx.clearRect(0, 0, width, height);

        const isDark = document.documentElement.classList.contains('dark');
        const particleAlpha = isDark ? 0.25 : 0.2;
        const lineAlphaMax = isDark ? 0.08 : 0.06;
        const baseColor = isDark ? '255, 255, 255' : '0, 0, 0';

        // Draw subtle monochrome cursor spotlight gradient
        if (mouse.x > 0 && mouse.y > 0) {
            const spotGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 240);
            const spotAlpha = isDark ? 0.07 : 0.04;
            spotGrad.addColorStop(0, `rgba(${baseColor}, ${spotAlpha})`);
            spotGrad.addColorStop(1, `rgba(${baseColor}, 0)`);
            ctx.fillStyle = spotGrad;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 240, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw connecting constellation lines
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.hypot(dx, dy);

                if (dist < CONNECT_DISTANCE) {
                    const alpha = (1 - dist / CONNECT_DISTANCE) * lineAlphaMax;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${baseColor}, ${alpha})`;
                    ctx.lineWidth = 0.75;
                    ctx.stroke();
                }
            }

            // Draw line to cursor if close
            const mouseDist = Math.hypot(mouse.x - p1.x, mouse.y - p1.y);
            if (mouseDist < MOUSE_RADIUS) {
                const mouseAlpha = (1 - mouseDist / MOUSE_RADIUS) * (isDark ? 0.25 : 0.2);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(${baseColor}, ${mouseAlpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw Particle Dot
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
            const dotAlpha = mouseDist < MOUSE_RADIUS ? particleAlpha * 2.5 : particleAlpha;
            ctx.fillStyle = `rgba(${baseColor}, ${dotAlpha})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    // Event Listeners
    window.addEventListener('mousemove', function (e) {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', function () {
        mouse.targetX = -1000;
        mouse.targetY = -1000;
    }, { passive: true });

    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 100);
    }, { passive: true });

    // Initialize
    resize();
    animate();
})();
