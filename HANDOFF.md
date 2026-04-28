# HANDOFF

## Purpose

This file is the restart brief for any new session working on the redesign of this project.

## Current Status

- The redesigned homepage is already the active homepage.
- The app route in `src/App.jsx` renders `HomeV4` at `/`.
- The reference design lives in `V4/src/App.tsx`.
- Real project content is being sourced from the existing content system under `content/**` via `src/lib/content.js`.
- Real artwork images live in `public/images/**`.
- The redesign should preserve existing content, copy, and images. Do not replace them with placeholders.

## Important Files

- `src/App.jsx`
- `src/pages/HomeV4.jsx`
- `src/components/Nav.jsx`
- `src/components/Footer.jsx`
- `src/lib/content.js`
- `content/settings/site.json`
- `content/paintings/*.md`
- `content/exhibitions/*.md`
- `content/pages/*.md`
- `public/images/**`
- `V4/src/App.tsx`

## What Was Broken

- The homepage previously showed a blank screen because `src/pages/HomeV4.jsx` rendered `GalleryItem`, but that component did not exist in the live app.

## What Was Fixed

- Added the missing `GalleryItem` component to `src/pages/HomeV4.jsx`.
- Wired gallery cards to the real painting routes using `Link`.
- Updated the footer to use the real settings key from `content/settings/site.json`:
  - use `inquiry_email` instead of assuming `email`
- Verified that the app builds successfully.

## Verification Performed

- `npm run build` passes.
- Local preview was successfully served at `http://127.0.0.1:4173` during the last session.

## Known Non-Blocking Issues

- `npm run lint` still reports repo-wide ESLint issues in files outside this specific handoff fix.
- These lint errors are not the cause of the blank homepage.
- If doing a cleanup pass later, treat lint work as separate from redesign fidelity work.

## Source Of Truth

For future work, treat these as source of truth in this order:

1. Existing live project content in `content/**` and `public/images/**`
2. Active implementation in `src/pages/HomeV4.jsx`
3. Design reference in `V4/src/App.tsx`

## Next Session Goal

Compare the live implementation against the reference design and continue refining the redesign without losing real content.

## Recommended Prompt For A New Session

```md
Continue the redesign work for this project.

Context:
- The new homepage redesign is already wired into the live app.
- The active homepage route is `src/App.jsx` -> `HomeV4` from `src/pages/HomeV4.jsx`.
- `V4/src/App.tsx` is the visual reference for the redesign.
- Content must remain sourced from the existing project content files under `content/**` and images under `public/images/**`.
- Do not replace real content with placeholder images or copy.
- The previous blank homepage issue was caused by a missing `GalleryItem` in `src/pages/HomeV4.jsx`; that has been fixed.
- Footer settings should use `content/settings/site.json`, especially `inquiry_email`.

What I want:
- Review the current implementation against `V4/src/App.tsx`
- Identify what was successfully ported and what is still missing or inaccurate
- Continue refining the redesign while preserving all existing content
- Run the app and verify changes in preview before finishing

Start by reading:
- `HANDOFF.md`
- `src/App.jsx`
- `src/pages/HomeV4.jsx`
- `src/components/Nav.jsx`
- `src/components/Footer.jsx`
- `src/lib/content.js`
- `content/**`
- `V4/src/App.tsx`
```

## Short Prompt Option

```md
Continue this redesign. The active homepage is `src/pages/HomeV4.jsx`, routed from `src/App.jsx`. Use `V4/src/App.tsx` as the redesign reference, but keep all real content and images from `content/**` and `public/images/**`. Do not use placeholders. First compare current `HomeV4` to `V4/src/App.tsx`, then implement missing pieces and verify in preview.
```
