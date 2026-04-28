# Design System Document

## 1. Overview & Creative North Star: "The Digital Curator"
This design system is built upon the philosophy of the "White Cube" gallery—a space where the architecture is intentionally quiet to allow the art to speak with maximum volume. We are moving beyond the standard "portfolio template" to create a bespoke editorial experience. 

The **Creative North Star** for this system is **The Digital Curator**. Unlike traditional websites that "box in" content, this system treats the browser viewport as an open exhibition hall. We achieve a premium feel through intentional asymmetry, dramatic typographic scales, and a rejection of traditional structural lines. By utilizing overlapping elements and generous "breathing room," we invite the user to linger on each piece of work, transforming a simple scroll into a guided tour.

---

## 2. Colors & Tonal Depth
The palette is a sophisticated study in neutrals, leaning into off-whites and charcols to create a sense of timelessness.

### The Palette
- **Core Neutrals:** Using `surface` (#fcf9f8) and `on-surface` (#1c1b1b) creates a high-contrast environment that feels softer than pure black-on-white.
- **The Sage Accent:** `primary-container` (#cad2c5) serves as our subtle nod to organic materiality, used sparingly for highlights or soft backgrounds.

### Implementation Rules
*   **The "No-Line" Rule:** Visual separation must never be achieved through 1px solid borders. Boundaries are defined strictly through background color shifts. For example, a `surface-container-low` section should sit directly against a `surface` background to define its start and end.
*   **Surface Hierarchy & Nesting:** Treat the UI as a series of physical layers—like fine sheets of weighted paper stacked on a stone plinth. Use the `surface-container` tiers (Lowest to Highest) to create depth. A detailed metadata panel should use `surface-container-highest` to feel closer to the user than the main `surface`.
*   **The "Glass & Gradient" Rule:** To avoid a flat, "digital" feel, use Glassmorphism for floating navigation menus. Apply `surface` at 70% opacity with a 20px backdrop-blur. 
*   **Signature Textures:** Use subtle gradients from `primary` (#596156) to `primary-container` (#cad2c5) for primary Call-to-Action states to provide a sense of "soul" and depth that static hex codes cannot provide.

---

## 3. Typography: Editorial Authority
The typographic system relies on the tension between the classical elegance of the Serif and the technical precision of the Sans-Serif.

*   **Display & Headlines (Noto Serif):** These are your "Gallery Signage." Use `display-lg` (3.5rem) for main titles. Don't be afraid to use asymmetrical alignment—placing a headline far to the left or right to create white space tension.
*   **Body & Metadata (Manrope):** This is your "Curator’s Note." Manrope provides a clean, modern contrast. Use `label-md` or `label-sm` for technical data (dimensions, medium, year) to mimic the small placards found next to physical paintings.
*   **The Hierarchy of Silence:** Ensure that the weight of the font matches the importance of the art. When the artwork is vibrant, keep the typography in `on-surface-variant` (#444842) to ensure it recedes.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "software-like" for a high-end portfolio. We use **Tonal Layering** to convey hierarchy.

*   **The Layering Principle:** Depth is achieved by "stacking" surface tiers. Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f6f3f2) section to create a soft, natural lift.
*   **Ambient Shadows:** If a floating element (like a lightbox) requires a shadow, it must be an **Ambient Shadow**: `blur: 40px`, `opacity: 6%`, and the color should be a tinted version of `on-surface` (not pure black).
*   **The "Ghost Border" Fallback:** If containment is absolutely necessary for accessibility, use the **Ghost Border**: `outline-variant` (#c5c7c0) at 15% opacity. Never use 100% opaque borders.
*   **Glassmorphism:** Use semi-transparent `surface` colors for persistent elements like top navigation bars. This allows the artwork to "bleed" through as the user scrolls, creating an integrated, immersive feeling.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#596156) with `on-primary` (#ffffff) text. Use `roundedness-sm` (0.125rem) for a sharp, architectural look. No shadows; use a 2px vertical offset on hover.
*   **Tertiary:** Text-only in `on-surface`. Use an underline that is only 1px thick and offset by 4px, which expands to full width on hover.

### Cards & Lists
*   **The "No Divider" Mandate:** Forbid the use of horizontal lines to separate list items. Use vertical white space (32px or 48px from the Spacing Scale) or subtle background shifts between `surface` and `surface-container-low`.
*   **Image Containers:** Artwork should never have a border. Use a `surface-dim` placeholder while loading to maintain the "framed" footprint.

### Input Fields
*   **Styling:** Minimalist. Only a bottom-border using `outline-variant` at 30% opacity. Upon focus, the border becomes `primary` and transitions smoothly. Labels should use `label-md` and sit 8px above the input.

### Selection Chips
*   **Filter Chips:** Use `surface-container-high` with `on-surface-variant`. When selected, transition to `primary-container` with `on-primary-container`. Keep corners sharp (`roundedness-sm`).

### Custom Component: The "Exhibition Slider"
A horizontal scroll component where the artwork is not clipped by the container but flows off the edge of the screen, using `surface-container-lowest` as a "matting" around the images.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Place a large image on the left and its title/description in a narrow column on the far right.
*   **Use Generous Whitespace:** If you think there is enough space, add 20% more. Space is a luxury in digital design.
*   **Prioritize Image Quality:** Ensure all imagery is high-resolution, as the neutral palette will expose any compression artifacts.

### Don't:
*   **Don't use 1px Dividers:** They clutter the "Gallery" and make it feel like a spreadsheet.
*   **Don't use standard "Grey":** Always use the specific neutrals provided (charcoals and off-whites) to maintain the tonal warmth of the design system.
*   **Don't use rounded corners (> 0.5rem):** High-end editorial design is usually defined by crisp, sharp edges. Avoid the "bubbly" look of consumer apps.