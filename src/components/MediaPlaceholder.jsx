export default function MediaPlaceholder({ text = "Image forthcoming" }) {
  // Uses a beautiful abstract Unsplash image as a default placeholder
  return (
    <div className={`w-full h-full relative overflow-hidden bg-transparent flex items-center justify-center`}>
      <img 
        src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80" 
        alt="Placeholder"
        className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale mix-blend-multiply"
      />
      <span className="relative z-10 font-label text-[10px] uppercase tracking-widest text-white/80 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
        {text}
      </span>
    </div>
  )
}
