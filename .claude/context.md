# AdLapse Extension - Project Context

## Project Overview
AdLapse is a browser extension that transforms Amazon Prime Video ad breaks into productive learning time. Instead of watching ads, users see educational content that rotates every 20 seconds.

**Current Version:** 1.0.0
**Status:** Functional, in development
**Browser Support:** Chrome (Manifest V3), Firefox (Manifest V2)

## What It Does
1. Detects when ads play on Prime Video (www.amazon.com/primevideo or www.primevideo.com)
2. Overlays the video player with educational content
3. Rotates content every 20 seconds during ad breaks
4. Automatically removes overlay when ad ends

## Content Types
- **News Headlines**: Fetched from Reddit r/worldnews (public JSON API)
- **Poetry**: Random poems from PoetryDB API
- **Vocabulary**: Curated word list with definitions

## Key Technical Details

### Ad Detection (content.js)
Uses Amazon's own internal class names to detect ads - highly reliable:
- Primary: `.atvwebplayersdk-ad-timer-text`, `.atvwebplayersdk-ad-timer-countdown`
- Fallbacks: `.atvwebplayersdk-seek-unavailable-text`, `.atvwebplayersdk-go-ad-free-button`, `.atvwebplayersdk-ad-resume-message`
- All elements verified for visibility (`offsetWidth > 0`)
- See DETECTION_METHODS.md for detailed explanation

### Architecture
- **content.js**: Ad detection, overlay injection, DOM manipulation
- **background.js**: Service worker, fetches content from APIs
- **popup.html/js**: User settings interface
- **overlay.css**: Overlay styling
- **manifest.json**: Chrome config (V3)
- **manifest_firefox.json**: Firefox config (V2)

### Browser Switching
- Scripts provided: `switch-to-chrome.sh`, `switch-to-firefox.sh`
- Swap manifest files to switch target browser

## Current State
### Implemented
- ✅ Robust ad detection using Amazon's internal classes
- ✅ Content fetching from multiple APIs
- ✅ Beautiful overlay UI with smooth animations
- ✅ Content rotation every 20 seconds
- ✅ User settings (enable/disable, content type selection)
- ✅ Both Chrome and Firefox support
- ✅ Icons generated and included

### Known Issues/TODOs
- Content rotation during long ads (implemented but needs testing)
- Error handling for API failures (fallback content exists)
- Potential need to update selectors if Amazon changes their UI

## Important Notes
- The extension doesn't block or skip ads (ToS compliant)
- Ads continue playing in background, just overlaid with content
- Detection is based on visible Amazon UI elements, not video player state
- Free APIs used (no auth required)

## Future Enhancement Ideas
- More content sources (Wikipedia, quotes, trivia, fun facts)
- Statistics tracking (time saved, content viewed)
- Multi-language support
- Theme customization (dark/light mode)
- User-submitted content preferences
- Timer showing remaining ad duration

## Development Notes
- Project not in git repo yet
- Located at: /home/lorin/Documents/adlapse-extension
- Linux development environment (6.14.0-34-generic)
- Testing requires loading as unpacked extension in browser

## Last Updated
2025-11-07: Initial context file created
