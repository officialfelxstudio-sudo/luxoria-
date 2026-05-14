/**
 * LUX0RIA Gaming Portal - JavaScript
 * Interactive functionality & event handling
 */

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

/**
 * Shorthand untuk document.getElementById()
 * @param {string} id - Element ID
 * @returns {Element}
 */
const $ = id => document.getElementById(id);

/* ========================================
   HELP PANEL TOGGLE
   ======================================== */

/**
 * Help panel functionality:
 * - Click BANTUAN button → Panel open/close
 * - Click outside → Panel close
 */

$('helpToggle').addEventListener('click', e => {
  e.stopPropagation(); // Prevent triggering document click handler
  $('helpPanel').classList.toggle('open');
});

// Close help panel when clicking outside
document.addEventListener('click', e => {
  if (!$('helpPanel').contains(e.target) && e.target !== $('helpToggle')) {
    $('helpPanel').classList.remove('open');
  }
});

/* ========================================
   VIEW SWITCHING (Home ↔ Menu)
   ======================================== */

/**
 * View switching system:
 * - View 1: Home screen dengan DONATE button
 * - View 2: Menu screen dengan list menu items
 * 
 * Animasi:
 * - Home exit: Slide left with fade out
 * - Menu enter: Slide left into view
 */

const homeV = $('view-home');
const menuV = $('view-menu');
let mOpen = false; // Flag untuk prevent spam clicks

$('btnViewMore').addEventListener('click', () => {
  if (mOpen) return; // Prevent multiple simultaneous transitions
  
  mOpen = true;
  menuV.classList.add('enter');
  homeV.classList.add('exit');
  
  setTimeout(() => {
    mOpen = false;
  }, 500);
});

$('btnBack').addEventListener('click', () => {
  if (mOpen) return; // Prevent multiple simultaneous transitions
  
  mOpen = true;
  homeV.classList.remove('exit');
  menuV.classList.remove('enter');
  
  setTimeout(() => {
    mOpen = false;
  }, 500);
});

/* ========================================
   PB PRIVATE DROPDOWN TOGGLE
   ======================================== */

/**
 * Dropdown functionality untuk PB PRIVATE menu:
 * - Click toggle button → Dropdown expand/collapse
 * - Click outside → Dropdown collapse
 * - Animasi: Max-height transition dari 0 ke 200px
 */

$('pbToggle').addEventListener('click', e => {
  e.preventDefault();
  
  const dropdown = $('pbDropdown');
  const tag = $('pbTag');
  
  // Toggle dropdown open state
  const isOpen = dropdown.classList.toggle('open');
  
  // Update label text based on state
  tag.textContent = isOpen ? 'PILIH ▴' : 'SELECT ▾';
});

// Close dropdown when clicking outside
document.addEventListener('click', e => {
  if (!$('pbToggle').contains(e.target)) {
    $('pbDropdown').classList.remove('open');
    $('pbTag').textContent = 'SELECT ▾';
  }
});

/* ========================================
   REPORT MODAL HANDLING
   ======================================== */

/**
 * Report modal functionality:
 * - Click "REPORT MEMBER" → Modal open
 * - Click close button / outside modal → Modal close
 * - ESC key → Modal close
 */

$('btnReport').addEventListener('click', () => {
  $('reportModal').classList.add('open');
});

$('modalClose').addEventListener('click', () => {
  $('reportModal').classList.remove('open');
});

// Close modal when clicking overlay background
$('reportModal').addEventListener('click', e => {
  if (e.target === $('reportModal')) {
    $('reportModal').classList.remove('open');
  }
});

/* ========================================
   REPORT FORM SUBMISSION
   ======================================== */

/**
 * Report form handling:
 * - Gather form data (nama pelaku, deskripsi, file bukti)
 * - Generate mailto: link with all info
 * - Show success message
 * - Auto close after 3 seconds
 * 
 * Form Fields:
 * - namaPelaku: Name of the perpetrator
 * - deskripsi: Description of violation
 * - buktiFile: File upload (photo/video)
 * 
 * Email Target: officialclanlux0ria@gmail.com
 */

$('reportForm').addEventListener('submit', e => {
  e.preventDefault();
  
  const form = e.target;
  const fileInput = form.buktiFile;
  
  // Check if file is selected
  if (!fileInput.files[0]) {
    alert('Harap pilih file bukti (foto/video)');
    return;
  }
  
  const file = fileInput.files[0];
  const fileName = file.name;
  const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
  
  // Build email body with form data
  const body = `NAMA PELAKU: ${form.namaPelaku.value}\n\nDESKRIPSI PELANGGARAN:\n${form.deskripsi.value}\n\nBUKTI FILE:\n- Nama File: ${fileName}\n- Ukuran: ${fileSize}\n- Tipe: ${file.type}\n\n*Catatan: File bukti akan dikirim sebagai attachment terpisah`;
  
  // Generate and trigger mailto: link
  window.location.href = `mailto:officialclanlux0ria@gmail.com?subject=REPORT%20PELANGGARAN%3A%20${encodeURIComponent(form.namaPelaku.value)}&body=${encodeURIComponent(body)}`;
  
  // Show success message
  const statusEl = $('report-status');
  statusEl.textContent = '✓ Silakan lanjutkan pengiriman di aplikasi email Anda.';
  statusEl.style.display = 'block';
  
  // Reset form
  form.reset();
  
  // Auto close after 4 seconds
  setTimeout(() => {
    statusEl.style.display = 'none';
    $('reportModal').classList.remove('open');
  }, 4000);
});

/* ========================================
   ESCAPE KEY HANDLER
   ======================================== */

/**
 * ESC key closes:
 * - Report modal
 * - Help panel
 */

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    $('reportModal').classList.remove('open');
    $('helpPanel').classList.remove('open');
  }
});

/* ========================================
   LIVE CLOCK / HUD TIME
   ======================================== */

/**
 * Live clock update setiap 1 detik di HUD corner
 * Format: HH:MM:SS (Indonesian timezone)
 * 
 * Display location: .hud-corner #hud-time
 */

(function tick() {
  const time = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const timeEl = $('hud-time');
  if (timeEl) {
    timeEl.textContent = time;
  }
  
  // Schedule next update
  setTimeout(tick, 1000);
})();

/* ========================================
   INITIALIZATION COMPLETE
   ======================================== */

console.log('LUX0RIA Portal initialized ✓');
