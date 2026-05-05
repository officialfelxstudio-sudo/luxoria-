/* =============================================
   LUXORIA - Interactive Scripts
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initCrosshair();
    initGlitchText();
    initParallax();
});

/* Crosshair Follows Mouse */
function initCrosshair() {
    const crosshair = document.getElementById('crosshair');
    if (!crosshair) return;

    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
        crosshair.style.display = 'none';
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        const ease = 0.15;
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;

        crosshair.style.left = currentX + 'px';
        crosshair.style.top = currentY + 'px';

        requestAnimationFrame(animate);
    }

    animate();
}

/* Random Glitch Text Effect */
function initGlitchText() {
    const title = document.getElementById('glitchTitle');
    if (!title) return;

    const originalText = title.textContent;
    title.setAttribute('data-text', originalText);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    let interval = null;

    function glitchEffect() {
        let iteration = 0;
        clearInterval(interval);

        interval = setInterval(() => {
            title.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iteration >= originalText.length) {
                clearInterval(interval);
                title.textContent = originalText;
            }

            iteration += 1 / 2;
        }, 30);
    }

    // Trigger glitch periodically
    setInterval(() => {
        if (Math.random() > 0.6) {
            glitchEffect();
        }
    }, 4000);

    // Trigger on hover
    title.addEventListener('mouseenter', glitchEffect);
}

/* Subtle Parallax on Cards */
function initParallax() {
    const cards = document.querySelectorAll('.tactical-card');

    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (e.clientX - centerX) / centerX;
        const moveY = (e.clientY - centerY) / centerY;

        cards.forEach((card, index) => {
            const depth = (index + 1) * 0.5;
            const x = moveX * depth * -2;
            const y = moveY * depth * -2;

            // Only apply if not currently hovered
            if (!card.matches(':hover')) {
                card.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    });
}
