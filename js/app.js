(function() {
// HobbyBoard Frontend Logic

const State = {
  // Minimal state for Phase 1
};

// UI Elements
const themeToggleDesktop = document.getElementById('themeToggleDesktop');

// --- Initialization ---

function init() {
  loadSettings();
  initListeners();
}

function loadSettings() {
  const theme = localStorage.getItem('hb_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('hb_theme', next);
}

// --- Listeners ---

function initListeners() {
  if (themeToggleDesktop) themeToggleDesktop.onclick = toggleTheme;
}

init();
})();