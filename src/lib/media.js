// Detect the media kind of a URL so renderers and the lightbox know
// whether to show an <img>, a <video>, or an embed <iframe>.

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i
const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|avif|svg)(\?.*)?$/i

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/,
]
const VIMEO_PATTERN = /vimeo\.com\/(?:video\/|channels\/[\w-]+\/|groups\/[\w-]+\/videos\/)?(\d+)/

export function mediaType(url) {
  if (!url || typeof url !== 'string') return 'unknown'
  if (extractYouTubeId(url)) return 'youtube'
  if (extractVimeoId(url)) return 'vimeo'
  if (VIDEO_EXTENSIONS.test(url)) return 'video'
  if (url.includes('/video/upload/')) return 'video' // Cloudinary video URLs without an extension
  if (IMAGE_EXTENSIONS.test(url)) return 'image'
  return 'image' // sensible default — most pasted URLs in this site are images
}

export function isVideoLike(url) {
  const t = mediaType(url)
  return t === 'video' || t === 'youtube' || t === 'vimeo'
}

export function extractYouTubeId(url) {
  if (!url) return null
  for (const re of YOUTUBE_PATTERNS) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

export function extractVimeoId(url) {
  if (!url) return null
  const m = url.match(VIMEO_PATTERN)
  return m ? m[1] : null
}

export function youtubeEmbedUrl(url) {
  const id = extractYouTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

export function vimeoEmbedUrl(url) {
  const id = extractVimeoId(url)
  return id ? `https://player.vimeo.com/video/${id}` : null
}
