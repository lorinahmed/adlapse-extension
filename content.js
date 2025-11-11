// Content script that runs on Prime Video pages
// Detects ads and shows/hides overlay

let overlayElement = null;
let isAdPlaying = false;
let checkInterval = null;
let userPreferences = { contentType: 'news', enabled: true };
let debugMode = false; // Disable debug logging for production
let manuallyClosedByUser = false; // Track if user manually closed overlay
let contentRotationInterval = null; // Interval for rotating content

// Initialize the extension
function init() {
  console.log('🎬 AdLapse Extension: Initialized');

  // Load user preferences with fallback for Firefox
  console.log('📦 Attempting to load settings from storage...');

  try {
    // Use chrome.storage.local instead of sync for better Firefox compatibility
    const storage = chrome.storage && chrome.storage.local ? chrome.storage.local : chrome.storage.sync;

    storage.get(['contentType', 'enabled'], (result) => {
      if (chrome.runtime.lastError) {
        console.error('❌ Storage error:', chrome.runtime.lastError);
        console.log('🔄 Starting with default settings');
        startAdDetection(); // Start anyway with defaults
        return;
      }

      userPreferences.contentType = result.contentType || 'news';
      userPreferences.enabled = result.enabled !== false;

      console.log('⚙️ Settings loaded:', userPreferences);

      if (userPreferences.enabled) {
        startAdDetection();
      } else {
        console.warn('❌ Extension is disabled in settings');
      }
    });

    // Timeout fallback - if storage doesn't respond in 2 seconds, start anyway
    setTimeout(() => {
      if (!checkInterval) {
        console.warn('⏰ Storage timeout - starting with defaults');
        startAdDetection();
      }
    }, 2000);
  } catch (error) {
    console.error('❌ Storage access failed:', error);
    console.log('🔄 Starting with default settings anyway');
    startAdDetection(); // Start anyway with defaults
  }

  // Listen for preference changes
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.contentType) {
      userPreferences.contentType = changes.contentType.newValue;
    }
    if (changes.enabled !== undefined) {
      userPreferences.enabled = changes.enabled.newValue;
      if (userPreferences.enabled) {
        startAdDetection();
      } else {
        stopAdDetection();
        hideOverlay();
      }
    }
  });
}

// Debug functions removed for production

// Start checking for ads
function startAdDetection() {
  if (checkInterval) return;

  console.log('🔍 Ad detection started - checking every 500ms');
  console.log('💡 TIP: When an ad plays, check the console for detection info');

  // Check every 500ms for ads
  let checkCount = 0;
  checkInterval = setInterval(() => {
    const adDetected = detectAd();
    checkCount++;

    // Log every 20 checks (10 seconds) if in debug mode
    if (debugMode && checkCount % 20 === 0) {
      console.log(`🔍 Check #${checkCount}: Ad detected = ${adDetected}, isAdPlaying = ${isAdPlaying}`);
    }

    if (adDetected && !isAdPlaying) {
      console.log('🎯 Ad detected!');
      isAdPlaying = true;
      manuallyClosedByUser = false; // Reset manual close flag for new ad
      showOverlay();
    } else if (!adDetected && isAdPlaying) {
      console.log('✅ Ad ended - no ad indicators found');
      isAdPlaying = false;
      manuallyClosedByUser = false; // Reset for next ad
      hideOverlay();
    } else if (adDetected && isAdPlaying && manuallyClosedByUser) {
      // User manually closed, don't re-show until ad ends
      if (checkCount % 20 === 0) {
        console.log('⏸️ Ad still playing but user closed overlay');
      }
    }
  }, 500);
}

// Stop ad detection
function stopAdDetection() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}

// Detect if an ad is currently playing
function detectAd() {
  let detectionMethod = null;

  // Method 1: Check for Amazon's specific ad timer classes (MOST RELIABLE)
  const adTimerElements = document.querySelectorAll(
    '.atvwebplayersdk-ad-timer-text, .atvwebplayersdk-ad-timer, .atvwebplayersdk-ad-timer-countdown'
  );

  if (adTimerElements.length > 0) {
    // Verify it's visible and has content
    for (const element of adTimerElements) {
      if (element.offsetWidth > 0 && element.textContent?.trim()) {
        // IMPORTANT: Check if text actually contains "Ad" to avoid false positives
        const text = element.textContent.trim();
        if (text.toLowerCase().includes('ad')) {
          detectionMethod = `Amazon ad timer class: ${element.className}`;
          if (debugMode && !isAdPlaying) {
            console.log(`🎯 Ad detected via ${detectionMethod}`, text);
          }
          return true;
        } else if (debugMode) {
          console.log(`⚠️ Ad timer element found but no "ad" text:`, text);
        }
      }
    }
  }

  // Method 2: Check for "seek unavailable during ads" message
  const seekUnavailable = document.querySelector('.atvwebplayersdk-seek-unavailable-text');
  if (seekUnavailable && seekUnavailable.offsetWidth > 0) {
    detectionMethod = 'Seek unavailable message';
    if (debugMode && !isAdPlaying) {
      console.log(`🎯 Ad detected via ${detectionMethod}`, seekUnavailable.textContent);
    }
    return true;
  }

  // Method 3: Check for "Go ad free" button inside player
  const adFreeButton = document.querySelector('.atvwebplayersdk-go-ad-free-button');
  if (adFreeButton && adFreeButton.offsetWidth > 0) {
    detectionMethod = 'Go ad free button in player';
    if (debugMode && !isAdPlaying) {
      console.log(`🎯 Ad detected via ${detectionMethod}`);
    }
    return true;
  }

  // Method 4: Look for "Your video continues here after the break"
  const resumeMessage = document.querySelector('.atvwebplayersdk-ad-resume-message');
  if (resumeMessage && resumeMessage.offsetWidth > 0) {
    detectionMethod = 'Video resume message';
    if (debugMode && !isAdPlaying) {
      console.log(`🎯 Ad detected via ${detectionMethod}`);
    }
    return true;
  }

  return false;
}

// Mute all video elements
function muteVideos() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    if (!video.muted) {
      video.muted = true;
      video.dataset.mutedByExtension = 'true';
      console.log('🔇 Video muted');
    }
  });
}

// Unmute videos that were muted by extension
function unmuteVideos() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    if (video.dataset.mutedByExtension === 'true') {
      video.muted = false;
      delete video.dataset.mutedByExtension;
      console.log('🔊 Video unmuted');
    }
  });
}

// Refresh overlay content
function refreshOverlayContent() {
  if (!overlayElement) return;

  console.log('🔄 Refreshing overlay content');

  // Request new content from background script
  chrome.runtime.sendMessage(
    { action: 'getContent', contentType: userPreferences.contentType },
    (response) => {
      if (!overlayElement) return; // Overlay was closed during request

      if (chrome.runtime.lastError) {
        console.error('❌ Error refreshing content:', chrome.runtime.lastError);
        return;
      }

      if (response && response.content) {
        console.log('✅ Content refreshed:', response.content.type);
        updateOverlayContent(response.content);
      }
    }
  );
}

// Update existing overlay with new content
function updateOverlayContent(content) {
  if (!overlayElement) return;

  const contentDiv = overlayElement.querySelector('.prime-overlay-content');
  if (contentDiv) {
    // Add fade effect
    contentDiv.style.opacity = '0';
    contentDiv.style.transition = 'opacity 0.3s';

    setTimeout(() => {
      contentDiv.querySelector('.prime-overlay-main').innerHTML = generateMainContent(content);
      contentDiv.querySelector('.prime-overlay-header').textContent = getHeaderText(content.type);
      contentDiv.style.opacity = '1';
    }, 300);
  }
}

// Start content rotation
function startContentRotation() {
  // Clear any existing rotation
  stopContentRotation();

  // Rotate content every 20 seconds
  contentRotationInterval = setInterval(() => {
    if (overlayElement && !manuallyClosedByUser) {
      refreshOverlayContent();
    }
  }, 20000);

  console.log('🔄 Content rotation started (every 20 seconds)');
}

// Stop content rotation
function stopContentRotation() {
  if (contentRotationInterval) {
    clearInterval(contentRotationInterval);
    contentRotationInterval = null;
    console.log('🛑 Content rotation stopped');
  }
}

// Show the overlay
function showOverlay() {
  if (overlayElement) {
    console.log('⚠️ Overlay already showing');
    return;
  }

  if (manuallyClosedByUser) {
    console.log('⏸️ User manually closed overlay, not showing again until next ad');
    return;
  }

  console.log('📺 Showing overlay with content type:', userPreferences.contentType);

  // Mute videos when showing overlay
  muteVideos();

  // Request content from background script
  chrome.runtime.sendMessage(
    { action: 'getContent', contentType: userPreferences.contentType },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error('❌ Error communicating with background:', chrome.runtime.lastError);
        createOverlay({ type: 'loading' });
        return;
      }

      if (response && response.content) {
        console.log('✅ Content received:', response.content.type);
        createOverlay(response.content);
        // Start rotating content every 20 seconds
        startContentRotation();
      } else {
        console.warn('⚠️ No content received, using loading state');
        createOverlay({ type: 'loading' });
      }
    }
  );
}

// Create overlay element
function createOverlay(content) {
  console.log('🎨 Creating overlay element');
  overlayElement = document.createElement('div');
  overlayElement.className = 'prime-overlay-container';
  overlayElement.innerHTML = generateOverlayHTML(content);

  // Add close button listener
  overlayElement.addEventListener('close-overlay', () => {
    console.log('👆 User manually closed overlay');
    manuallyClosedByUser = true;
    hideOverlay();
  });

  document.body.appendChild(overlayElement);
  console.log('✅ Overlay added to page');
}

// Generate main content HTML based on content type
function generateMainContent(content) {
  if (content.type === 'loading') {
    return '<div class="loading">Loading content</div>';
  } else if (content.type === 'news') {
    return `
      <div class="news-headline">${content.title}</div>
      <div class="news-description">${content.description}</div>
      <div class="news-source">Source: ${content.source}</div>
    `;
  } else if (content.type === 'poem') {
    return `
      <div class="poem-title">${content.title}</div>
      <div class="poem-author">by ${content.author}</div>
      <div class="poem-lines">${content.lines}</div>
    `;
  } else if (content.type === 'language') {
    return `
      <div class="language-word">${content.word}</div>
      <div class="language-translation">${content.translation}</div>
      <div class="language-example">"${content.example}"</div>
    `;
  }
  return '<div class="loading">Loading content</div>';
}

// Generate HTML for overlay based on content type
function generateOverlayHTML(content) {
  return `
    <button class="prime-overlay-close" onclick="this.closest('.prime-overlay-container').dispatchEvent(new Event('close-overlay'))">
      ✕
    </button>
    <div class="prime-overlay-content">
      <div class="prime-overlay-header">
        ${getHeaderText(content.type)}
      </div>
      <div class="prime-overlay-main">
        ${generateMainContent(content)}
      </div>
      <div class="prime-overlay-footer">
        Ad playing in background • Click ✕ to close and hear ad • Content rotates every 20s
      </div>
    </div>
  `;
}

// Get header text based on content type
function getHeaderText(type) {
  const headers = {
    news: '📰 Latest News',
    poem: '📖 Poetry Corner',
    language: '🌍 Learn Something New',
    loading: '⏳ Loading...'
  };
  return headers[type] || 'AdLapse';
}

// Hide the overlay
function hideOverlay() {
  if (overlayElement) {
    console.log('🗑️ Removing overlay');
    overlayElement.remove();
    overlayElement = null;

    // Stop content rotation
    stopContentRotation();

    // Unmute videos when hiding overlay
    unmuteVideos();
  } else {
    console.log('⚠️ No overlay to remove');
  }
}

// Start the extension when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
