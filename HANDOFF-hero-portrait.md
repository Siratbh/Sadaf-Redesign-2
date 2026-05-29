# Handoff — Homepage hero portrait (B&W)  →  for Gemini

## Goal
Feature the artist's portrait photo in the **top-right of the homepage hero**, in **black & white**.
Requirements agreed with the client:
- **Always black & white** (CSS filter, not a pre-converted image).
- **CMS-editable** so the client can swap it via Decap / Netlify Visual Editor.
- **Mobile:** stacks **below** the hero text, centered and contained.

## Project context (how this site works)
- React + Vite SPA. Homepage component: `src/pages/HomeV4.jsx`. Routed from `src/App.jsx` at `/`.
- Content is file-based markdown in `content/pages/*.md`, edited through:
  - **Decap CMS** — `public/admin/config.yml`
  - **Netlify Visual Editor / Stackbit** — `stackbit.config.ts`
  Every editable element carries a `data-sb-field-path` attribute.
- B&W is done purely with the Tailwind `grayscale` class — the original color photo is untouched. This matches the existing About section, where the decoration images already use `grayscale`.

## What was done (this change)
1. **New CMS field `hero_portrait_image`** registered in BOTH configs (they must stay in sync):
   - `stackbit.config.ts` — HomePage model, Hero group (~line 215).
   - `public/admin/config.yml` — the `home` collection (`file: content/pages/home.md`), under the `# ── Hero ──` block. Label **"Hero — Featured Portrait"**, `media_folder: /public/images/about`, `public_folder: /images/about`.
2. **Default value** in `content/pages/home.md` frontmatter:
   ```yaml
   hero_portrait_image: /images/about/Sadaf-hero-portrait.jpeg
   ```
   ⚠️ Exact casing/extension matters — `Sadaf-hero-portrait.jpeg` — because Netlify builds on case-sensitive Linux.
3. **Image file** at `public/images/about/Sadaf-hero-portrait.jpeg`.
4. **Render** in `src/pages/HomeV4.jsx`:
   - Value read near the other `home.*` reads (~line 175):
     ```jsx
     const heroPortrait = home.hero_portrait_image; // optional B&W portrait, top-right of hero
     ```
   - Markup added as the **2nd child of the hero top row** — the `<div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 md:mb-16">`, right after the `max-w-2xl` text block:
     ```jsx
     {heroPortrait && (
       <Motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
         className="w-full max-w-xs mx-auto md:mx-0 md:w-[34%] md:max-w-sm md:flex-shrink-0"
       >
         <div className="relative aspect-[3/4] overflow-hidden">
           <img
             src={heroPortrait}
             alt="Sadaf Farasat"
             className="w-full h-full object-cover grayscale"
             data-sb-field-path="hero_portrait_image"
           />
         </div>
       </Motion.div>
     )}
     ```
   - Layout logic: on mobile (`flex-col`) the portrait is the 2nd child so it stacks below the text; on desktop (`md:flex-row` + `md:items-end`) it sits right of the text. `aspect-[3/4]` + `object-cover` crops to a portrait frame; `grayscale` makes it B&W.

## Current status
- Renders correctly in local dev: desktop = portrait top-right + text left; mobile (~390px) = text first, portrait stacked below; B&W in both. Lint passes on `HomeV4.jsx`. **Not yet committed.**

## How to run / verify
- `npm run dev` → open http://localhost:5173/
- Resize to ~390px wide to check mobile stacking.
- The Netlify Visual Editor needs a two-terminal local flow (separate `stackbit dev`) — but for a pure CSS/layout fix, `npm run dev` alone is enough.

## Files to look at
- `src/pages/HomeV4.jsx`  ← the render (hero top row + `heroPortrait`)
- `content/pages/home.md`  ← the image path
- `public/images/about/Sadaf-hero-portrait.jpeg`  ← the photo
- `stackbit.config.ts`, `public/admin/config.yml`  ← CMS field (only touch if changing how it's edited)

---

## THE ISSUE — Design Audit & Proposed Solutions

### What's Wrong (The Design Audit)

1. **Desktop Disproportion (The "Skyscraper" Effect):**
   The text block (headline + subheadline) is naturally short and horizontal. The portrait uses `aspect-[3/4]` (a tall vertical crop) and takes up to 34% of the container width (`max-w-sm`). By using `md:items-end`, the image anchors to the bottom but shoots up awkwardly high past the top of the text block. This creates a staggered, unbalanced layout that feels like a default flexbox consequence rather than a deliberate editorial choice.
2. **Mobile Disconnect (The Detached Card):**
   On mobile, the image has `max-w-xs mx-auto`, restricting it to 320px wide and centering it. The text above it is left-aligned and spans the full width of the container. This mixed alignment and width discrepancy makes the portrait look like a detached, floating component rather than a cohesive part of the hero narrative.
3. **Aesthetic Misalignment:**
   Right now, it feels like a standard "two-column web layout." For a high-craft gallery aesthetic (luxury minimal / editorial), the image placement needs to feel intentional—either as a subtle, intimate inset or a sweeping, cinematic anchor.

---

### Proposed Solutions

Here are three distinct ways to fix this, following the `frontend-design` guidelines:

#### Solution 1: The Editorial Inset (Recommended)
Make the image a smaller, more intimate supporting element rather than competing with the headline.
- **Desktop:** Reduce the width significantly (e.g., `md:w-[25%] md:max-w-[240px]`). Switch alignment to `md:items-start` so the top of the image aligns cleanly with the cap-height of the headline. Shift to a tighter `aspect-[4/5]` or `aspect-square`.
- **Mobile:** Remove the `max-w-xs mx-auto` centering. Make it left-aligned to match the text and take up `w-full` (100% of the container). Use a cinematic landscape crop on mobile (`aspect-[16/9]` or `aspect-[3/2]`) so it proportionately anchors the text without dominating vertical space.

#### Solution 2: The Cinematic Banner (Decoupled)
Break the side-by-side layout entirely to give the text and the image their own breathing room.
- **Desktop & Mobile:** Let the text block take up the full width. Place the portrait *below* the text block as a full-width (or edge-to-edge) banner. 
- **Crop:** Use a short, ultra-wide aspect ratio (e.g., `aspect-[21/9]` on desktop, `aspect-[16/9]` on mobile). This turns the B&W portrait into an atmospheric transition element before reaching the featured slideshow.

#### Solution 3: The "Stamp" (Maximal Restraint)
Treat the portrait like a tiny, high-density editorial detail.
- **Desktop:** Make the image a strict, small square (e.g., `w-32 h-32` or `w-40 h-40`) floating next to the subheadline, right-aligned. It serves as a visual signature rather than a hero image.
- **Mobile:** Keep it small, perhaps aligning it to the left edge just below the subhead, alongside a refined border or caption, avoiding the "large blocky image" trap entirely.
