#!/bin/bash
# Switch to Firefox manifest

cd "$(dirname "$0")"

# Copy Firefox manifest as active manifest (preserving originals)
cp manifest_firefox.json manifest.json
echo "✓ Copied Firefox manifest to manifest.json (Manifest V2)"
echo "✓ Original manifest_firefox.json preserved"
echo ""
echo "Now load the extension in Firefox:"
echo "1. Open Firefox → about:debugging#/runtime/this-firefox"
echo "2. Click 'Load Temporary Add-on'"
echo "3. Select manifest.json in: $(pwd)"
echo "4. Done! Test on Prime Video"
