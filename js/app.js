(function() {
// HobbyBoard Frontend Logic

const State = {
  // Minimal state
};

// UI Elements
const themeToggleDesktop = document.getElementById('themeToggleDesktop');
const menuToggle = document.getElementById('menuToggle');
const drawer = document.getElementById('drawer');
const drawerClose = document.getElementById('drawerClose');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const themeToggleText = document.getElementById('themeToggleText');

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

// --- Listeners ---

function initListeners() {
  if (themeToggleDesktop) themeToggleDesktop.onclick = toggleTheme;
  
  if (menuToggle) menuToggle.onclick = toggleDrawer;
  if (drawerClose) drawerClose.onclick = toggleDrawer;
  if (drawerBackdrop) drawerBackdrop.onclick = toggleDrawer;
  
  if (themeToggleMobile) themeToggleMobile.onclick = () => {
    toggleTheme();
  };
}

init();
})();