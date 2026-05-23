// Derived data + formatting helpers for the exhibitions pages.

import { getPainting } from './content'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function toDate(value) {
  if (!value) return null
  if (value instanceof Date) return isNaN(value) ? null : value
  const d = new Date(value)
  return isNaN(d) ? null : d
}

// Format a start/end date pair into a single human-readable string.
// Falls back to yearFallback (the `year` field) when no dates are set.
export function formatDateRange(start, end, yearFallback) {
  const s = toDate(start)
  const e = toDate(end)

  if (!s && !e) return yearFallback || null
  if (s && !e) return `${MONTHS[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()}`
  if (!s && e) return `${MONTHS[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`

  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth() && s.getDate() === e.getDate()) {
    return `${MONTHS[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()}`
  }
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${MONTHS[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`
  }
  if (s.getFullYear() === e.getFullYear()) {
    return `${MONTHS[s.getMonth()]} ${s.getDate()} — ${MONTHS[e.getMonth()]} ${e.getDate()}, ${s.getFullYear()}`
  }
  return `${MONTHS[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()} — ${MONTHS[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`
}

// Resolve which image to show on an exhibition's archive-grid card.
// Tries: card_thumbnail → hero_image → first gallery image → first linked painting's image.
// Returns null if no image is available anywhere.
export function cardImage(ex) {
  if (!ex) return null
  if (ex.card_thumbnail) return ex.card_thumbnail
  if (ex.hero_image) return ex.hero_image
  if (Array.isArray(ex.gallery)) {
    const firstImg = ex.gallery.find(g => g && g.image)
    if (firstImg) return firstImg.image
  }
  if (Array.isArray(ex.works_shown)) {
    for (const slug of ex.works_shown) {
      const p = getPainting(slug)
      if (p && (p.featured_image || p.thumbnail_image)) {
        return p.featured_image || p.thumbnail_image
      }
    }
  }
  return null
}

// Pick up to N featured exhibitions for the listing page hero/NEXT slots.
// Manually-flagged (`featured: true`) entries take precedence, sorted by year desc.
// If fewer than N are flagged, auto-fill from the most recent entries that have
// a usable card image (so we don't render a featured slot with no visual).
export function pickFeatured(exhibitions, count = 2) {
  if (!Array.isArray(exhibitions) || exhibitions.length === 0) return []

  const byRecency = (a, b) => {
    const ay = parseInt(a.year, 10) || 0
    const by = parseInt(b.year, 10) || 0
    if (by !== ay) return by - ay
    // Same year — break ties by sort_order ascending (lower = more prominent)
    return (a.sort_order ?? 99) - (b.sort_order ?? 99)
  }

  const flagged = exhibitions.filter(ex => ex.featured).sort(byRecency)
  const picked = [...flagged]
  const pickedIds = new Set(picked.map(ex => ex.slug))

  if (picked.length < count) {
    const autoFill = exhibitions
      .filter(ex => !pickedIds.has(ex.slug) && cardImage(ex))
      .sort(byRecency)
    for (const ex of autoFill) {
      if (picked.length >= count) break
      picked.push(ex)
    }
  }

  return picked.slice(0, count)
}
