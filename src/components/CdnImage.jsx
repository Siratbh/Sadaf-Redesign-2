import { netlifyImage, netlifyImageSrcSet } from '../lib/image'

/**
 * Drop-in <img> replacement that routes local /images/... paths through the
 * Netlify Image CDN (resize + AVIF/WebP). External URLs pass through untouched.
 *
 * All non-listed props (alt, className, loading, decoding, fetchPriority,
 * data-sb-field-path, onClick, draggable, width, height, style...) are spread
 * onto the underlying <img>, so Stackbit Visual Editor annotations and every
 * existing attribute are preserved verbatim.
 *
 * @param {string}   src       root-absolute local path (or any URL)
 * @param {number[]} [widths]  widths for srcset, e.g. [300, 450, 600]
 * @param {string}   [sizes]   the CSS `sizes` attribute
 * @param {number}   [w]       target width for the base src (srcset fallback)
 * @param {number}   [h]       target height for the base src
 * @param {string}   [fit]     contain | cover | fill (default: cover)
 * @param {number}   [q]       quality 1-100 (default: 75)
 */
export default function CdnImage({ src, widths, sizes, w, h, fit = 'cover', q = 75, ...rest }) {
  if (!src) return null
  // Base src: target the largest srcset width (or explicit w/h) so the fallback
  // is itself optimized, never the raw original.
  const baseW = w ?? (widths?.length ? widths[widths.length - 1] : undefined)
  const baseSrc = netlifyImage(src, { w: baseW, h, fit, q })
  const srcSet = widths ? netlifyImageSrcSet(src, widths, { fit, q }) : undefined
  return <img src={baseSrc} srcSet={srcSet} sizes={sizes} {...rest} />
}
