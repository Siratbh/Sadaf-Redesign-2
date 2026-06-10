// Netlify Image CDN helpers.
//
// In production, rewrite local /images/... paths through the built-in
// /.netlify/images endpoint for on-the-fly resizing + automatic AVIF/WebP
// negotiation (omit `fm` and Netlify picks the best format from the Accept
// header). Transformed responses are edge-cached and invalidated on each deploy.
//
// In dev (plain `vite` / `stackbit dev`, NOT `netlify dev`) the /.netlify/images
// endpoint doesn't exist, so we return the raw src unchanged. This means local
// `npm run dev` shows NO optimization by design — verify on a Netlify build.

// Only local, root-absolute asset paths (e.g. "/images/paintings/foo.jpg") get
// routed through the CDN. External URLs (Unsplash, i.ytimg.com, Vimeo), data/
// blob URIs, protocol-relative URLs, and already-transformed URLs pass through.
function shouldTransform(src) {
  if (!src || typeof src !== 'string') return false
  if (src.startsWith('/.netlify/images')) return false // already transformed
  if (!src.startsWith('/')) return false // external / data / blob
  if (src.startsWith('//')) return false // protocol-relative
  return true
}

/**
 * Build a single Netlify Image CDN URL.
 * @param {string} src   Root-absolute local path, e.g. "/images/paintings/foo.jpg"
 * @param {object} [opts]
 * @param {number} [opts.w]   target width (px)
 * @param {number} [opts.h]   target height (px)
 * @param {string} [opts.fit] contain | cover | fill (default: cover)
 * @param {number} [opts.q]   quality 1-100 (default: 75)
 * @param {string} [opts.position] crop alignment when fit=cover
 * @returns {string} CDN URL in prod; raw src in dev / for pass-through cases.
 */
export function netlifyImage(src, { w, h, fit = 'cover', q = 75, position } = {}) {
  if (!src) return src
  if (import.meta.env.DEV) return src // plain vite dev: no /.netlify/images
  if (!shouldTransform(src)) return src

  // URLSearchParams encodes the path exactly once — do NOT pre-encode `src`.
  const params = new URLSearchParams()
  params.set('url', src)
  if (w) params.set('w', String(w))
  if (h) params.set('h', String(h))
  if (fit) params.set('fit', fit)
  if (q) params.set('q', String(q))
  if (position) params.set('position', position)
  return `/.netlify/images?${params.toString()}`
}

/**
 * Build a responsive `srcset` string at multiple widths.
 * Returns undefined in dev / for pass-through cases so the <img> falls back to
 * its plain `src` (React drops srcset={undefined} from the DOM).
 * @param {string} src
 * @param {number[]} widths e.g. [400, 800, 1200]
 * @param {object} [opts] { fit, q }
 * @returns {string|undefined}
 */
export function netlifyImageSrcSet(src, widths = [], { fit = 'cover', q = 75 } = {}) {
  if (import.meta.env.DEV) return undefined
  if (!shouldTransform(src) || !widths.length) return undefined
  return widths.map((w) => `${netlifyImage(src, { w, fit, q })} ${w}w`).join(', ')
}
