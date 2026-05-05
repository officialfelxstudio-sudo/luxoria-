/* =============================================
   LUXORIA - Interactive Scripts
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initTacticalUI();
    initCrosshair();
    initGlitchText();
    initParallax();
    initParticles();
    initScrollTop();
    initSoundEffects();
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

/* Preloader */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progress = document.getElementById('preloaderProgress');
    const percentage = document.getElementById('preloaderPercentage');
    
    if (!preloader) return;
    
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 15;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 300);
        }
        progress.style.width = width + '%';
        percentage.textContent = Math.floor(width) + '%';
    }, 100);
}

/* Particle Animation */
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* Scroll to Top Button */
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* Sound Effects (Web Audio API) */
function initSoundEffects() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function playHoverSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    }
    
    function playClickSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    const cards = document.querySelectorAll('.tactical-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            playHoverSound();
        });
        
        card.addEventListener('click', () => {
            playClickSound();
        });
    });
}

/* Tactical UI - Timer, Ping, FPS, Alerts */
function initTacticalUI() {
    initMissionTimer();
    initPingFPS();
    initAlertMessages();
}

function initMissionTimer() {
    const timerEl = document.getElementById('missionTimer');
    if (!timerEl) return;
    
    let seconds = 0;
    setInterval(() => {
        seconds++;
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        timerEl.textContent = `${h}:${m}:${s}`;
    }, 1000);
}

function initPingFPS() {
    const pingEl = document.getElementById('pingValue');
    const fpsEl = document.getElementById('fpsValue');
    
    if (pingEl) {
        setInterval(() => {
            const ping = Math.floor(Math.random() * 30) + 5;
            pingEl.textContent = ping;
        }, 2000);
    }
    
    if (fpsEl) {
        setInterval(() => {
            const fps = Math.floor(Math.random() * 30) + 120;
            fpsEl.textContent = fps;
        }, 500);
    }
}

function initAlertMessages() {
    const alertEl = document.getElementById('alertMsg');
    if (!alertEl) return;
    
    const messages = [
        'ALL SYSTEMS OPERATIONAL',
        'TACTICAL NETWORK ACTIVE',
        'ENCRYPTION: ENABLED',
        'SIGNAL STRENGTH: 100%',
        'FIREWALL: PROTECTED'
    ];
    
    let index = 0;
    setInterval(() => {
        index = (index + 1) % messages.length;
        alertEl.style.opacity = '0';
        setTimeout(() => {
            alertEl.textContent = messages[index];
            alertEl.style.opacity = '1';
        }, 300);
    }, 4000);
}
