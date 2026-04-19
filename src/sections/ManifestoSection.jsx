export default function ManifestoSection({ content }) {
  const c = content || {}
  return (
    <section
      className="relative min-h-[80vh] w-full flex flex-col justify-center items-center py-24 md:py-32 px-6 md:px-24 bg-surface"
      id="genesis-section"
    >
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-8 md:mb-12 block reveal-item">
          The Genesis
        </span>
        <h2 className="font-headline text-5xl md:text-7xl leading-tight tracking-tighter mb-10 md:mb-14 text-on-surface reveal-item">
          {c.headline || (
            <>
              A Dialogue with <br /><i className="italic">Light &amp; Void</i>
            </>
          )}
        </h2>
        <div className="space-y-6 max-w-2xl mx-auto">
          <p className="font-body text-base md:text-lg leading-relaxed text-on-surface-variant font-light reveal-item text-balance">
            {c.body || 'Each stroke is an inquiry into the space between perception and reality. My practice explores the delicate tension where architectural rigidity meets the fluid entropy of the natural world.'}
          </p>
          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant pt-8 reveal-item">
            {c.tagline || 'Curating Silence since 2014'}
          </p>
        </div>
      </div>
    </section>
  )
}
