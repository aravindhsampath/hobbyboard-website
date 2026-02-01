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

let autoPlayInterval;
let isPaused = false;

// --- Initialization ---

function init() {
  loadSettings();
  initListeners();
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
      // If user manually clicks, we reset the loop effectively
      // We don't stop it permanently, just let it continue from the new point
      activateTab(e.target);
      startAutoPlay(); // Restart timer to give full 4s on the new tab
    };
  });

  // Intersection Observer for Efficiency
  if (showcaseSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoPlay();
        } else {
          stopAutoPlay();
        }
      });
    }, { threshold: 0.4 }); // Wait until 40% visible
    
    observer.observe(showcaseSection);
    
    // Pause on Hover behavior
    showcaseSection.addEventListener('mouseenter', () => isPaused = true);
    showcaseSection.addEventListener('mouseleave', () => isPaused = false);
  } else {
    // Fallback if no observer support (rare)
    startAutoPlay();
  }
}

init();
})();