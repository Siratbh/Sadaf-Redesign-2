import { useEffect, useState } from 'react'
import SEOHead from '../components/SEOHead'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import siteSettings from '../../content/settings/site.json'

gsap.registerPlugin(ScrollTrigger)

const contactData = {
  intro: 'For inquiries about available works, private viewings, institutional loans, or simply to connect.',
  email: siteSettings.inquiry_email || 'inquiry@sadafart.com',
  response_note: 'Responses within 2–3 working days.',
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', reason: '', message: '' })
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    document.body.classList.add('is-light')
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-item').forEach(item => {
        gsap.fromTo(item,
          { y: 50, opacity: 0, filter: 'blur(8px)', scale: 0.98 },
          {
            scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' },
            y: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.2, ease: 'power3.out',
          }
        )
      })
    })
    return () => { ctx.revert(); document.body.classList.remove('is-light') }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'contact', ...form }).toString(),
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inputClass = 'w-full bg-transparent border-0 border-b border-stone-300 focus:ring-0 focus:border-dark-text text-dark-text py-3 px-0 transition-colors outline-none font-body text-base'
  const labelClass = 'font-label text-[10px] uppercase tracking-widest text-stone-500 mb-2 block'

  return (
    <>
      <SEOHead title="Contact" description={contactData.intro} />

      <div className="min-h-screen bg-light-bg text-dark-text">
        {/* Hero */}
        <section className="min-h-[40vh] flex flex-col justify-end px-6 md:px-24 pt-32 pb-16 md:pb-24">
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-stone-500 mb-6 block">Reach Out</span>
          <h1 className="font-headline text-[14vw] md:text-[8vw] leading-[0.85] tracking-tighter">
            <i>Get in Touch</i>
          </h1>
        </section>

        <section className="px-6 md:px-24 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left: info */}
          <div className="lg:col-span-4 flex flex-col gap-10 reveal-item">
            <p className="font-body text-base text-stone-600 leading-relaxed max-w-xs">
              {contactData.intro}
            </p>
            <div>
              <span className={labelClass}>Email</span>
              <a
                href={`mailto:${contactData.email}`}
                className="font-body text-base text-dark-text border-b border-stone-300 pb-1 hover:border-dark-text transition-colors cursor-none"
              >
                {contactData.email}
              </a>
            </div>
            {siteSettings.instagram && (
              <div>
                <span className={labelClass}>Instagram</span>
                <a
                  href={siteSettings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-base text-dark-text border-b border-stone-300 pb-1 hover:border-dark-text transition-colors cursor-none"
                >
                  @sadaf
                </a>
              </div>
            )}
            <p className="font-label text-[10px] uppercase tracking-widest text-stone-500 mt-auto">
              {contactData.response_note}
            </p>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-8 reveal-item">
            {status === 'success' ? (
              <div className="flex flex-col gap-6 pt-4">
                <h2 className="font-headline text-5xl italic tracking-tight">Thank you.</h2>
                <p className="font-body text-base text-stone-600 leading-relaxed max-w-sm">
                  Your message has been received. I'll be in touch within a few days.
                </p>
              </div>
            ) : (
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="flex flex-col gap-10"
              >
                <input type="hidden" name="form-name" value="contact" />
                <input type="hidden" name="bot-field" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input type="text" required className={inputClass} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" required className={inputClass} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Reason</label>
                  <select className={`${inputClass} cursor-none`} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}>
                    <option value="">General inquiry</option>
                    <option value="availability">Availability of a work</option>
                    <option value="private-viewing">Private viewing</option>
                    <option value="institutional">Institutional / loan</option>
                    <option value="press">Press</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Message</label>
                  <textarea rows={5} required className={`${inputClass} resize-none`} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                </div>

                {status === 'error' && (
                  <p className="font-label text-[10px] uppercase tracking-widest text-red-500">
                    Something went wrong. Please email directly at {contactData.email}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="self-start bg-dark-text text-white px-12 py-4 font-label text-[10px] uppercase tracking-[0.3em] hover:bg-black transition-colors cursor-none disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
