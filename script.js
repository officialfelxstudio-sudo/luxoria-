/* =============================================
   LUXORIA — Gaming Scripts
   script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCanvas();
    initCardColors();
    initRipple();
    initTouchFeedback();
    initGlitch();
    initClock();
    initScrollTop();
    initReportModal();
});

/* ---- Preloader ---- */
function initPreloader() {
    const bar = document.getElementById('preBar');
    const pct = document.getElementById('prePct');
    const pre = document.getElementById('preloader');
    if (!pre) return;

    let w = 0;
    const iv = setInterval(() => {
        w += Math.random() * 16 + 2;
        if (w >= 100) {
            w = 100;
            clearInterval(iv);
            setTimeout(() => pre.classList.add('out'), 300);
        }
        if (bar) bar.style.width = w + '%';
        if (pct) pct.textContent = Math.floor(w) + '%';
    }, 70);
}

/* ---- Animated Canvas Background ---- */
function initCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [], lines = [];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Floating particles
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.size  = Math.random() * 1.5 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = -Math.random() * 0.5 - 0.1;
            this.life   = Math.random();
            this.maxLife = Math.random() * 0.4 + 0.2;
            this.color  = Math.random() > 0.5 ? '240,192,64' : '0,212,255';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= 0.002;
            if (this.life <= 0 || this.y < 0) this.reset();
        }
        draw() {
            const a = Math.min(this.life / this.maxLife, 1) * 0.5;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${a})`;
            ctx.fill();
        }
    }

    // Slow diagonal grid lines
    class GridLine {
        constructor(i) {
            this.x = (W / 8) * i;
            this.opacity = Math.random() * 0.04 + 0.01;
        }
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, 0);
            ctx.lineTo(this.x, H);
            ctx.strokeStyle = `rgba(240,192,64,${this.opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());
    for (let i = 0; i < 9; i++) lines.push(new GridLine(i));

    function animate() {
        ctx.clearRect(0, 0, W, H);
        lines.forEach(l => l.draw());
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

/* ---- Apply CSS custom color per card ---- */
function initCardColors() {
    document.querySelectorAll('.card').forEach(card => {
        const c = card.dataset.color;
        if (c) card.style.setProperty('--c', c);
    });
}

/* ---- Ripple Effect ---- */
function initRipple() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x    = e.clientX - rect.left - size / 2;
            const y    = e.clientY - rect.top  - size / 2;

            const r = document.createElement('span');
            r.className = 'ripple';
            r.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
            this.appendChild(r);
            setTimeout(() => r.remove(), 700);
        });
    });
}

/* ---- Touch press feedback ---- */
function initTouchFeedback() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transition = 'transform 0.08s ease';
            this.style.transform  = 'translateX(4px) scale(0.98)';
        }, { passive: true });

        card.addEventListener('touchend', function() {
            const el = this;
            setTimeout(() => {
                el.style.transform  = '';
                el.style.transition = '';
            }, 150);
        }, { passive: true });
    });
}

/* ---- Glitch Title ---- */
function initGlitch() {
    const el = document.getElementById('glitchTitle');
    if (!el) return;
    el.setAttribute('data-text', el.textContent);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%';
    const original = el.textContent;
    let iv = null;

    function glitch() {
        let iter = 0;
        clearInterval(iv);
        iv = setInterval(() => {
            el.textContent = original
                .split('')
                .map((ch, i) => i < iter ? original[i] : chars[Math.floor(Math.random() * chars.length)])
                .join('');
            if (iter >= original.length) {
                clearInterval(iv);
                el.textContent = original;
            }
            iter += 0.4;
        }, 28);
    }

    // Periodic glitch
    setInterval(() => { if (Math.random() > 0.5) glitch(); }, 5000);
    el.addEventListener('mouseenter', glitch);
}

/* ---- Live Clock in corner ---- */
function initClock() {
    const el = document.getElementById('clock');
    if (!el) return;
    function tick() {
        const d = new Date();
        const pad = n => String(n).padStart(2, '0');
        el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
    tick();
    setInterval(tick, 1000);
}

/* ---- Scroll to Top ---- */
function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 200);
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ---- Report Modal ---- */
function initReportModal() {
    const reportBtn = document.getElementById('reportBtn');
    const modal = document.getElementById('reportModal');
    const closeModal = document.getElementById('closeModal');
    const reportForm = document.getElementById('reportForm');
    const fileInput = document.getElementById('evidence');
    const filePreview = document.getElementById('filePreview');

    if (!reportBtn || !modal) return;

    // Open modal
    reportBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    const close = () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    };

    closeModal.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) close();
    });

    // File preview
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            filePreview.classList.remove('show');
            filePreview.innerHTML = '';
            return;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('Ukuran file terlalu besar! Maksimal 10MB.');
            fileInput.value = '';
            filePreview.classList.remove('show');
            filePreview.innerHTML = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const isVideo = file.type.startsWith('video');
            filePreview.innerHTML = `
                ${isVideo
                    ? `<video src="${e.target.result}" controls></video>`
                    : `<img src="${e.target.result}" alt="Preview">`
                }
                <button type="button" class="file-preview-remove">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    Hapus
                </button>
            `;
            filePreview.classList.add('show');

            // Remove file button
            filePreview.querySelector('.file-preview-remove').addEventListener('click', () => {
                fileInput.value = '';
                filePreview.classList.remove('show');
                filePreview.innerHTML = '';
            });
        };
        reader.readAsDataURL(file);
    });

    // Form submit
    reportForm.addEventListener('submit', (e) => {
        const memberName = document.getElementById('memberName').value.trim();
        const problem = document.getElementById('problem').value.trim();

        if (!memberName || !problem) {
            e.preventDefault();
            alert('Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        const submitBtn = reportForm.querySelector('.btn-submit');
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'MENGIRIM...';

        setTimeout(() => {
            showSuccessPopup();
            reportForm.reset();
            filePreview.classList.remove('show');
            filePreview.innerHTML = '';
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = originalText;
            close();
        }, 600);
    });

    // Success popup function
    function showSuccessPopup() {
        const popup = document.createElement('div');
        popup.className = 'success-popup';
        popup.innerHTML = `
            <div class="success-popup-content">
                <div class="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                </div>
                <h3>TERIMAKASIH SUDAH MELAPOR</h3>
                <p>Report Anda telah dikirim ke admin. Kami akan segera memprosesnya.</p>
            </div>
        `;
        document.body.appendChild(popup);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 300);
        }, 3000);
    }
}