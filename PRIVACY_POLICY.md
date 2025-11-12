# Privacy Policy for AdLapse

**Last Updated**: November 10, 2025

## Overview

AdLapse ("the Extension") is committed to protecting your privacy. This privacy policy explains what data we collect, how we use it, and your rights regarding your information.

## Data Collection

**We collect NO personal data.**

Specifically, AdLapse does NOT:
- Collect your name, email, or any identifying information
- Track your viewing history or what content you watch
- Collect or store which ads you see
- Track IP addresses or location data
- Use cookies or tracking pixels
- Share any data with third parties
- Transmit any personal information to external servers

## Data Storage

The Extension stores only ONE piece of information locally on your device:

- **Content Type Preference**: Your choice of content type (news, poetry, or vocabulary)

This preference is stored using your browser's local storage API (`chrome.storage.local`) and **never leaves your device**. You can change or delete this preference at any time through the extension popup.

## Network Requests

AdLapse makes network requests to fetch educational content from public APIs:

1. **Reddit API** (https://www.reddit.com/r/worldnews.json)
   - Purpose: Fetch news headlines
   - Public API, no authentication required
   - No user data is sent in these requests

2. **PoetryDB API** (https://poetrydb.org)
   - Purpose: Fetch random poems
   - Public educational API, no authentication required
   - No user data is sent in these requests

These third-party APIs may have their own privacy policies. AdLapse does not control or assume responsibility for the privacy practices of these services.

## Permissions Explained

The Extension requires the following browser permissions:

- **storage**: To save your content type preference locally on your device
- **activeTab**: To detect ads and display overlays only on Prime Video pages
- **host_permissions** (amazon.com, primevideo.com): To run only on Prime Video websites

These permissions are used exclusively for the Extension's core functionality and nothing else.

## What We See

AdLapse can read page elements on Amazon Prime Video to detect when ads are playing (such as ad timer elements and ad-related UI indicators). This information is:
- Used only to determine when to show the educational overlay
- Never stored or transmitted anywhere
- Processed entirely within your browser

## Children's Privacy

AdLapse does not knowingly collect information from anyone, including children under 13. The Extension does not collect personal data from any users.

## Data Security

Since we do not collect or transmit personal data, there is no personal data to secure. Your content preference is stored locally on your device using standard browser storage mechanisms.

## Your Rights

You have the right to:
- View your stored preference at any time (visible in the extension popup)
- Change your preference at any time
- Delete your preference by uninstalling the Extension
- Contact us with questions about privacy

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be posted at this URL and reflected in the extension listing. Continued use of the Extension after changes constitutes acceptance of the updated policy.

## Compliance

This Extension complies with:
- Chrome Web Store Developer Program Policies
- Firefox Add-on Policies
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)

Since we collect no personal data, most data protection regulations do not apply to this Extension's operation.

## Contact

If you have questions about this privacy policy or the Extension's privacy practices, please contact:

- **Email**: lorinahmed@gmail.com
- **GitHub**: https://github.com/lorinahmed/adlapse-extension/issues

## Summary

**In plain English**: AdLapse doesn't collect any information about you. It only remembers which content type you prefer (news, poetry, or vocabulary) and stores that choice on your device. Everything else the Extension does happens locally in your browser. Your privacy is fully protected.

---

**Your privacy matters. AdLapse is designed to be completely private by default.**
