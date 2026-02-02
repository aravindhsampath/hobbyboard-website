(function() {
// HobbyBoard Frontend Logic

// UI Elements
const themeToggleDesktop = document.getElementById('themeToggleDesktop');
const menuToggle = document.getElementById('menuToggle');
const drawer = document.getElementById('drawer');
const drawerClose = document.getElementById('drawerClose');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const themeToggleText = document.getElementById('themeToggleText');

// Browser Showcase Elements
const browserTabs = document.querySelectorAll('.browser-tab');
const browserImages = document.querySelectorAll('.browser-img');
const showcaseSection = document.querySelector('.browser-showcase');

// OS Switcher Elements
const osButtons = document.querySelectorAll('.os-btn');
const installContents = document.querySelectorAll('.install-content');

let autoPlayInterval;
let isPaused = false;

// --- Initialization ---

function init() {
  loadSettings();
  initListeners();
  detectOS();
}

function loadSettings() {
  const theme = localStorage.getItem('hb_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeUI(theme);
}

function updateThemeUI(theme) {
  if (themeToggleText) {
    themeToggleText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('hb_theme', next);
  updateThemeUI(next);
}

function toggleDrawer() {
  if (drawer) {
    drawer.classList.toggle('hidden');
  }
}

// --- Showcase Logic ---

function activateTab(tab) {
  const targetId = tab.getAttribute('data-target');
  
  // Update Tabs
  browserTabs.forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  
  // Update Images
  browserImages.forEach(img => {
    if (img.id === targetId) {
      img.classList.add('active');
    } else {
      img.classList.remove('active');
    }
  });
}

function nextSlide() {
  if (isPaused) return;
  
  let activeIndex = 0;
  browserTabs.forEach((tab, index) => {
    if (tab.classList.contains('active')) activeIndex = index;
  });
  
  const nextIndex = (activeIndex + 1) % browserTabs.length;
  activateTab(browserTabs[nextIndex]);
}

function startAutoPlay() {
  stopAutoPlay();
  // 4000ms interval to match the CSS animation duration
  autoPlayInterval = setInterval(nextSlide, 4000); 
}

function stopAutoPlay() {
  if (autoPlayInterval) clearInterval(autoPlayInterval);
  autoPlayInterval = null;
}

// --- Install Logic ---

function detectOS() {
  const platform = navigator.platform.toLowerCase();
  const userAgent = navigator.userAgent.toLowerCase();
  let os = 'linux'; // Default

  if (platform.includes('mac') || userAgent.includes('mac')) {
    os = 'mac';
  } else if (platform.includes('win') || userAgent.includes('win')) {
    os = 'windows';
  }
  
  switchOS(os);
}

function switchOS(os) {
  // Update Buttons
  osButtons.forEach(btn => {
    if (btn.getAttribute('data-os') === os) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update Content
  installContents.forEach(content => {
    if (content.id === `install-${os}`) {
      content.classList.remove('hidden');
    } else {
      content.classList.add('hidden');
    }
  });
}

// --- Listeners ---

function initListeners() {
  if (themeToggleDesktop) themeToggleDesktop.onclick = toggleTheme;
  
  if (menuToggle) menuToggle.onclick = toggleDrawer;
  if (drawerClose) drawerClose.onclick = toggleDrawer;
  if (drawerBackdrop) drawerBackdrop.onclick = toggleDrawer;
  
  if (themeToggleMobile) themeToggleMobile.onclick = () => {
    toggleTheme();
  };

  // Browser Tabs Manual Click
  browserTabs.forEach(tab => {
    tab.onclick = (e) => {
      activateTab(e.target);
      startAutoPlay();
    };
  });

  // Intersection Observer for Showcase
  if (showcaseSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoPlay();
        } else {
          stopAutoPlay();
        }
      });
    }, { threshold: 0.4 });
    
    observer.observe(showcaseSection);
    
    showcaseSection.addEventListener('mouseenter', () => isPaused = true);
    showcaseSection.addEventListener('mouseleave', () => isPaused = false);
  } else {
    startAutoPlay();
  }

  // OS Switcher Manual Click
  osButtons.forEach(btn => {
    btn.onclick = () => switchOS(btn.getAttribute('data-os'));
  });
  
  // Copy Buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.onclick = () => {
      const codeBlock = btn.parentElement.querySelector('code');
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.innerText).then(() => {
          const original = btn.innerHTML;
          btn.innerHTML = '<span style="font-size:12px; color:#fff;">Copied!</span>';
          setTimeout(() => btn.innerHTML = original, 2000);
        });
      }
    };
  });
}

init();
})();