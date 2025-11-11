# Ad Detection Methods

This document explains how the extension detects ads on Amazon Prime Video.

## Detection Strategy

The extension uses Amazon Prime Video's own internal class names to detect when ads are playing. These are highly reliable indicators that only appear during actual ad playback.

## Methods (in order of priority)

### Method 1: Ad Timer Classes ✅ MOST RELIABLE
**Classes searched:**
- `.atvwebplayersdk-ad-timer-text`
- `.atvwebplayersdk-ad-timer`
- `.atvwebplayersdk-ad-timer-countdown`

**Why it works:**
- These elements only exist during ad playback
- Display countdown like "Ad 2:18"
- Verified to be visible with `offsetWidth > 0`

**Example from inspection:**
```
Player 56: atvwebplayersdk-ad-timer-countdown - "Ad2:18"
Player 57: atvwebplayersdk-ad-timer - "Ad2:18"
Player 58: atvwebplayersdk-ad-timer-text - "Ad2:18"
```

### Method 2: Seek Unavailable Message
**Class:** `.atvwebplayersdk-seek-unavailable-text`

**Content:** "Fast forward and rewind unavailable during ads"

**Why it works:**
- Only displayed during ads
- Tells users they can't skip

### Method 3: Go Ad Free Button
**Class:** `.atvwebplayersdk-go-ad-free-button`

**Why it works:**
- Amazon upsell button shown during ads
- Only visible during ad playback
- Positioned in player overlay

### Method 4: Resume Message
**Class:** `.atvwebplayersdk-ad-resume-message`

**Content:** "Your video continues here after the break"

**Why it works:**
- Displayed during ads to inform users
- Only visible during ad breaks

## What We Learned

### Initial Approach (Failed)
- ❌ Searching for generic "Advertisement" text → Too many false positives
- ❌ Looking for "Ad" anywhere on page → Matches browse page elements
- ❌ Generic selectors → Unreliable

### Final Approach (Success)
- ✅ Use Amazon's specific class names
- ✅ Verify elements are visible (`offsetWidth > 0`)
- ✅ Multiple fallback methods
- ✅ No reliance on video player state (which can be inconsistent)

## Testing Notes

**From actual inspection during ad playback:**
- 2 video elements present (main content paused, ad playing)
- Ad timer found: "Ad2:18"
- Multiple Amazon-specific classes visible
- "Go ad free" button present in player

## Why This is Reliable

1. **Amazon's own indicators** - We're not guessing, we're using their UI elements
2. **Visibility checks** - Elements must be actually visible, not just in DOM
3. **Multiple methods** - If one fails, others catch it
4. **No false positives** - These elements ONLY appear during ads

## Future Maintenance

If Amazon changes their class names, update the selectors in `content.js` by:
1. Using the "🔍 Inspect Player" button during an ad
2. Looking for new ad-related classes in console output
3. Updating the selectors in `detectAd()` function
