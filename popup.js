// Popup script for managing extension settings

const enableToggle = document.getElementById('enableToggle');
const contentRadios = document.querySelectorAll('input[name="contentType"]');
const statusDiv = document.getElementById('status');

// Use local storage for better Firefox compatibility
const storage = chrome.storage && chrome.storage.local ? chrome.storage.local : chrome.storage.sync;

// Load saved settings on popup open
storage.get(['enabled', 'contentType'], (result) => {
  enableToggle.checked = result.enabled !== false;

  const selectedType = result.contentType || 'news';
  const selectedRadio = document.querySelector(`input[value="${selectedType}"]`);
  if (selectedRadio) {
    selectedRadio.checked = true;
  }
});

// Save enabled/disabled state
enableToggle.addEventListener('change', () => {
  const enabled = enableToggle.checked;
  storage.set({ enabled }, () => {
    showStatus(enabled ? 'Extension enabled!' : 'Extension disabled');
  });
});

// Save content type preference
contentRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    const contentType = radio.value;
    storage.set({ contentType }, () => {
      const labels = {
        news: 'News headlines selected',
        poem: 'Poems selected',
        language: 'Language learning selected'
      };
      showStatus(labels[contentType] || 'Settings saved');
    });
  });
});

// Show status message
function showStatus(message) {
  statusDiv.textContent = message;
  setTimeout(() => {
    statusDiv.textContent = 'Ready to make ad time productive!';
  }, 2000);
}
