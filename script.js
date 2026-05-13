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
  
  // Trigger home exit animation
  homeV.classList.add('exit');
  
  // After animation completes, swap views
  setTimeout(() => {
    homeV.style.display = 'none';
    menuV.style.display = 'flex';
    
    // Trigger reflow & menu enter animation
    requestAnimationFrame(() => {
      menuV.classList.add('enter');
    });
  }, 280); // Match CSS transition duration
});

$('btnBack').addEventListener('click', () => {
  mOpen = false;
  
  // Trigger menu exit animation
  menuV.classList.remove('enter');
  
  // After animation completes, swap views back
  setTimeout(() => {
    menuV.style.display = 'none';
    homeV.style.display = 'flex';
    
    // Trigger reflow & home enter animation
    requestAnimationFrame(() => {
      homeV.classList.remove('exit');
    });
  }, 280);
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
 * - Gather form data
 * - Generate mailto: link with all info
 * - Show success message
 * - Auto close after 3 seconds
 * 
 * Form Fields:
 * - member: Name of member being reported
 * - email: Reporter's email
 * - desc: Description of violation
 * - evidence: URL link to proof (photo/video)
 * 
 * Email Target: officialclanlux0ria@gmail.com
 */

$('reportForm').addEventListener('submit', e => {
  e.preventDefault();
  
  const form = e.target;
  
  // Build email body with form data
  const body = `Nama Member: ${form.member.value}\n\nEmail Pelapor: ${form.email.value}\n\nPelanggaran:\n${form.desc.value}\n\nBukti: ${form.evidence.value}`;
  
  // Generate and trigger mailto: link
  window.location.href = `mailto:officialclanlux0ria@gmail.com?subject=REPORT%20MEMBER%3A%20${encodeURIComponent(form.member.value)}&body=${encodeURIComponent(body)}`;
  
  // Show success message
  const statusEl = $('report-status');
  statusEl.style.display = 'block';
  
  // Reset form
  form.reset();
  
  // Auto close after 3 seconds
  setTimeout(() => {
    statusEl.style.display = 'none';
    $('reportModal').classList.remove('open');
  }, 3000);
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
