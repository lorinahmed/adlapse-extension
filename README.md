# AdLapse - Make Ad Time Productive

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome](https://img.shields.io/badge/Chrome-Compatible-green.svg)](https://www.google.com/chrome/)
[![Firefox](https://img.shields.io/badge/Firefox-Compatible-orange.svg)](https://www.mozilla.org/firefox/)

**Transform Amazon Prime Video ads into productive learning moments.**

AdLapse automatically detects ads and overlays them with engaging content - news headlines, poetry, or vocabulary building. Content rotates every 20 seconds to keep you engaged during long ad breaks.

**🎯 Turn wasted ad time into productive learning time!**

## Features

- **Ad Detection**: Automatically detects when ads are playing on Prime Video
- **Beautiful Overlays**: Covers ads with engaging, educational content
- **Multiple Content Types**:
  - 📰 Latest News Headlines (from Reddit)
  - 📖 Random Poetry (from PoetryDB)
  - 🌍 Vocabulary Building (curated word list)
- **Customizable**: Choose your preferred content type
- **Easy Toggle**: Enable/disable with one click

## Installation

### 1. Add Icons (Required)

The extension needs three icon files in the `icons/` folder:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can:
- Create simple icons using any image editor (GIMP, Photoshop, etc.)
- Download free icons from sites like flaticon.com or icons8.com
- Use a simple colored square with text for now

### 2. Load Extension in Your Browser

#### For Chrome:
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `prime-overlay-extension` folder
5. The extension should now appear in your extensions list

#### For Firefox:
1. **First, rename the manifest:**
   - Rename `manifest.json` to `manifest_chrome.json` (backup)
   - Rename `manifest_firefox.json` to `manifest.json`
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Navigate to the extension folder and select `manifest.json`
5. The extension will load (note: temporary add-ons are removed when Firefox closes)

**For permanent Firefox installation:**
- Package as `.xpi` file, or
- Use Firefox Developer Edition for persistent temporary add-ons

### 3. Using the Extension

1. Click the extension icon in your toolbar
2. Choose your preferred content type (News, Poems, or Language)
3. Toggle the extension on/off as needed
4. Visit Prime Video and play content with ads
5. When an ad plays, the overlay will automatically appear!

## Project Structure

```
prime-overlay-extension/
├── manifest.json          # Extension configuration (Chrome - Manifest V3)
├── manifest_firefox.json  # Firefox configuration (Manifest V2)
├── content.js            # Ad detection and overlay injection
├── overlay.css           # Overlay styling
├── background.js         # Content fetching from APIs
├── popup.html            # Settings UI
├── popup.js              # Settings logic
├── generate-icons.html   # Icon generator tool
├── modules/              # Future: Modular content fetchers
└── icons/                # Extension icons (add these!)
```

## How It Works

1. **Detection**: `content.js` monitors Prime Video pages for ad indicators (badges, timers, text)
2. **Request**: When an ad is detected, it requests content from the background script
3. **Fetch**: `background.js` fetches content from various free APIs
4. **Display**: A beautiful overlay is created and positioned over the video player
5. **Cleanup**: When the ad ends, the overlay is removed automatically

## Content Sources

- **News**: Reddit r/worldnews (public JSON API)
- **Poems**: PoetryDB API (free, no auth required)
- **Language**: Curated vocabulary list (expandable)

## Customization Ideas

- Add more content types (quotes, trivia, fun facts)
- Integrate with paid APIs for better content
- Add timer showing ad duration remaining
- Implement content rotation during long ads
- Add themes and custom styling options

## Troubleshooting

**Overlay not appearing?**
- Check that the extension is enabled in the popup
- Verify you're on Prime Video (www.amazon.com/primevideo or www.primevideo.com)
- Open browser console (F12) and look for "Prime Overlay" logs
- Ad detection selectors may need updating if Prime changes their UI

**Content not loading?**
- Check your internet connection
- APIs may be temporarily down - fallback content should still display
- Check browser console for error messages

## Future Enhancements

- [ ] More content sources (Wikipedia, Quotes, Trivia)
- [ ] User-submitted content preferences
- [ ] Statistics tracking (time saved, content viewed)
- [ ] Multi-language support
- [ ] Dark/light theme options
- [ ] Export/import settings

## License

This project is for educational purposes. Use responsibly and in accordance with Amazon's Terms of Service.

## Contributing

Feel free to fork and enhance! Pull requests welcome.

---

**Note**: This extension overlays content on your screen during ads. The ads still play in the background - this doesn't violate Amazon's ToS as you're not blocking or skipping ads, just choosing not to watch them.
