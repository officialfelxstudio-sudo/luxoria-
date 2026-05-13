const $ = id => document.getElementById(id);

// Help Panel Toggle
$('helpToggle').addEventListener('click', e => { 
    e.stopPropagation(); 
    $('helpPanel').classList.toggle('open'); 
});

document.addEventListener('click', e => { 
    if (!$('helpPanel').contains(e.target) && e.target !== $('helpToggle')) {
        $('helpPanel').classList.remove('open'); 
    }
});

// View Navigation (Home to Menu)
const homeV = $('view-home'), menuV = $('view-menu');
let mOpen = false;

$('btnViewMore').addEventListener('click', () => {
    if (mOpen) return;
    mOpen = true;
    homeV.classList.add('exit');
    setTimeout(() => { 
        homeV.style.display = 'none'; 
        menuV.style.display = 'flex'; 
        requestAnimationFrame(() => menuV.classList.add('enter')); 
    }, 280);
});

$('btnBack').addEventListener('click', () => {
    mOpen = false;
    menuV.classList.remove('enter');
    setTimeout(() => { 
        menuV.style.display = 'none'; 
        homeV.style.display = 'flex'; 
        requestAnimationFrame(() => homeV.classList.remove('exit')); 
    }, 280);
});

// PB Private Dropdown
$('pbToggle').addEventListener('click', e => {
    e.preventDefault();
    const dd = $('pbDropdown'), t = $('pbTag');
    const o = dd.classList.toggle('open');
    t.textContent = o ? 'PILIH ▴' : 'SELECT ▾';
});

document.addEventListener('click', e => { 
    if (!$('pbToggle').contains(e.target)) { 
        $('pbDropdown').classList.remove('open'); 
        $('pbTag').textContent = 'SELECT ▾'; 
    } 
});

// Report Modal
$('btnReport').addEventListener('click', () => $('reportModal').classList.add('open'));
$('modalClose').addEventListener('click', () => $('reportModal').classList.remove('open'));
$('reportModal').addEventListener('click', e => { 
    if (e.target === $('reportModal')) $('reportModal').classList.remove('open'); 
});

// Form Submission (Mailto)
$('reportForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const body = `Nama Member: ${f.member.value}\n\nEmail Pelapor: ${f.email.value}\n\nPelanggaran:\n${f.desc.value}\n\nBukti: ${f.evidence.value}`;
    
    window.location.href = `mailto:officialclanlux0ria@gmail.com?subject=REPORT%20MEMBER%3A%20${encodeURIComponent(f.member.value)}&body=${encodeURIComponent(body)}`;
    
    const s = $('report-status'); 
    s.style.display = 'block'; 
    f.reset();
    
    setTimeout(() => { 
        s.style.display = 'none'; 
        $('reportModal').classList.remove('open'); 
    }, 3000);
});

// ESC Key Listener
document.addEventListener('keydown', e => { 
    if (e.key === 'Escape') { 
        $('reportModal').classList.remove('open'); 
        $('helpPanel').classList.remove('open'); 
    } 
});

// HUD Clock
(function tick() {
    const t = new Date().toLocaleTimeString('id-ID', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
    const el = $('hud-time'); 
    if (el) el.textContent = t;
    setTimeout(tick, 1000);
})();