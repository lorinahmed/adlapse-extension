#!/bin/bash
# Switch to Chrome manifest

cd "$(dirname "$0")"

# Copy Chrome manifest as active manifest (preserving originals)
cp manifest_chrome.json manifest.json
echo "✓ Copied Chrome manifest to manifest.json (Manifest V3)"
echo "✓ Original manifest_chrome.json preserved"
echo ""
echo "Now load the extension in Chrome:"
echo "1. Open Chrome → chrome://extensions/"
echo "2. Enable 'Developer mode' (top right)"
echo "3. Click 'Load unpacked'"
echo "4. Select this folder: $(pwd)"
echo "5. Done! Test on Prime Video"
