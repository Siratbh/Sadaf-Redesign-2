// Shared ReactMarkdown `components` maps.
//
// `introComponents` is for short "intro/subhead" markdown fields where the
// editor can use any markdown the Stackbit / Decap toolbar offers (bold,
// italic, links, lists, headings, blockquotes, code, etc.) and we want it
// to actually render on the live site — but sized appropriately for an
// intro context, not as large as a long-form body article.
//
// Used by:
//   src/pages/HomeV4.jsx          → hero_subhead
//   src/pages/About.jsx           → bio_intro
//   src/pages/CollectorsEdit.jsx  → intro

export const introComponents = {
  p: ({ children }) => (
    <p className="leading-relaxed font-light text-sm sm:text-[15px]">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="underline decoration-brand-muted underline-offset-4 hover:text-brand-ink transition-colors"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-medium text-brand-ink">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,

  // Lists
  ul: ({ children }) => (
    <ul className="list-disc pl-5 space-y-1 text-sm sm:text-[15px] font-light">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 space-y-1 text-sm sm:text-[15px] font-light">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,

  // Headings — downscaled because an intro field is structurally a sub-heading
  // of the page; the editor's H1 shouldn't visually compete with the page's H1.
  h1: ({ children }) => (
    <h2 className="font-serif text-2xl sm:text-3xl text-brand-ink leading-tight mt-4">{children}</h2>
  ),
  h2: ({ children }) => (
    <h3 className="font-serif text-xl sm:text-2xl text-brand-ink leading-tight mt-3">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="font-serif text-lg sm:text-xl text-brand-ink leading-tight mt-3">{children}</h4>
  ),
  h4: ({ children }) => (
    <h5 className="font-medium text-base text-brand-ink mt-3">{children}</h5>
  ),
  h5: ({ children }) => (
    <h6 className="font-medium text-sm text-brand-ink mt-2">{children}</h6>
  ),
  h6: ({ children }) => (
    <p className="font-medium text-xs uppercase tracking-wider text-brand-ink mt-2">{children}</p>
  ),

  // Blockquote / code / pre / hr
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-brand-ink/40 pl-4 italic font-serif text-base sm:text-lg text-brand-ink/80">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="font-mono text-xs bg-brand-ink/5 px-1 py-0.5 rounded">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="font-mono text-xs bg-brand-ink/5 p-3 rounded overflow-x-auto">{children}</pre>
  ),
  hr: () => <hr className="border-brand-ink/10 my-4" />,
}
