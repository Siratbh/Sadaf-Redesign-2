import { motion as Motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { getCollectors, getPage } from '../lib/content'
import SEOHead from '../components/SEOHead'

export default function CollectorsEdit() {
  const collectors = getCollectors()
  const page = getPage('collectors-edit')

  return (
    <>
      <SEOHead
        title={page?.seo_title || 'The Collectors Edit'}
        description={page?.seo_description || ''}
      />

      <main className="bg-brand-bg min-h-screen pt-24 md:pt-32 pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-6xl text-brand-ink tracking-tight mb-6"
          >
            The Collectors Edit
          </Motion.h1>

          {page?.intro && (
            <Motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-brand-muted max-w-2xl text-base md:text-lg leading-relaxed mb-16"
            >
              {page.intro}
            </Motion.p>
          )}

          {collectors.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {collectors.map((item) => (
                <Motion.div
                  key={item.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="break-inside-avoid"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-brand-muted/10">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {item.painting_title && (
                    <p className="mt-3 text-sm text-brand-muted font-sans tracking-wide uppercase">
                      {item.painting_title}
                    </p>
                  )}
                </Motion.div>
              ))}
            </div>
          ) : (
            <p className="text-brand-muted/60 italic text-center py-20">
              Collector pieces will be added soon.
            </p>
          )}

          <div className="mt-16">
            <Link
              to="/"
              className="text-sm text-brand-muted font-sans uppercase tracking-wider hover:text-brand-ink transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
