# Refactoring TODO - DRY Violations

## Analysis Date: 2026-02-15
## Status: ✅ ALL COMPLETE

---

## 1. Lobster.js
- **Status:** ✅ FIXED
- **Fix:** Imports from `./versions/Lobster.v003.js`, passes tailSegments + angle

## 2. Hook.js
- **Status:** ✅ FIXED
- **Fix:** Imports from `./versions/Hook.v002.js`

## 3. Cage.js
- **Status:** ✅ FIXED
- **Fix:** Imports from `./versions/Cage.v002.js`

## 4. Net.js
- **Status:** ✅ FIXED
- **Fix:** Imports from `./versions/Net.v001.js`

## 5. Fork.js
- **Status:** ✅ FIXED
- **Fix:** Imports from `./versions/Fork.v001.js`

## 6. GoldenFish.js
- **Status:** ✅ FIXED
- **Fix:** Imports from `./versions/GoldenFish.v002.js`

## 7. Bubble.js
- **Status:** ✅ FIXED (earlier)
- **Fix:** Imports from `./versions/Bubble.v002.js`

---

## Shared Utilities

### Created:
- `utils/colors.js` - hslToRgba, COLOR_PRESETS, resolveHue

---

## Summary

All game classes now import from their versioned renderers.
No duplicate drawing code.
Single source of truth for each entity's visual appearance.
