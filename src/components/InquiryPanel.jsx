import { useEffect, useState } from 'react'

export default function InquiryPanel({ isOpen, onClose, paintingTitle }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', reason: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'inquiry',
          ...form,
          ...(paintingTitle ? { painting: paintingTitle } : {}),
        }).toString(),
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const inputClass = 'w-full bg-transparent border-0 border-b border-stone-800 focus:ring-0 focus:border-white text-stone-100 py-2 px-0 transition-colors outline-none font-body text-sm'
  const labelClass = 'font-label text-[10px] uppercase tracking-widest text-stone-500 mb-2 block'

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[205] bg-black/40 transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 h-full w-full md:w-[450px] z-[210] bg-[#050505] flex flex-col p-8 md:p-12 gap-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-headline italic text-2xl text-stone-100">
              {paintingTitle ? 'Work Inquiry' : 'Get in Touch'}
            </h3>
            {paintingTitle && (
              <p className="font-label text-[10px] uppercase tracking-widest text-stone-500 mt-1">
                Re: {paintingTitle}
              </p>
            )}
          </div>
          <button
            className="font-label text-[10px] uppercase tracking-widest text-stone-500 hover:text-white transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {status === 'success' ? (
          <div className="flex-1 flex flex-col justify-center">
            <p className="font-headline italic text-4xl text-stone-100 leading-tight">Thank you.</p>
            <p className="font-body text-sm text-stone-500 mt-4">Your message has been received. A response will follow within a few days.</p>
          </div>
        ) : (
          <form
            name="inquiry"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col gap-8"
          >
            <input type="hidden" name="form-name" value="inquiry" />
            <input type="hidden" name="bot-field" />
            {paintingTitle && <input type="hidden" name="painting" value={paintingTitle} />}

            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                required
                className={inputClass}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                required
                className={inputClass}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            {!paintingTitle && (
              <div>
                <label className={labelClass}>Reason</label>
                <select
                  className={`${inputClass}`}
                  value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                >
                  <option value="">General inquiry</option>
                  <option value="availability">Availability of a work</option>
                  <option value="private-viewing">Private viewing</option>
                  <option value="institutional">Institutional / loan</option>
                  <option value="press">Press</option>
                </select>
              </div>
            )}
            <div>
              <label className={labelClass}>Message</label>
              <textarea
                rows={4}
                required
                className={`${inputClass} resize-none`}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              />
            </div>

            {status === 'error' && (
              <p className="font-label text-[10px] uppercase tracking-widest text-red-400">
                Something went wrong. Please try again or email directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-auto w-full bg-white text-black py-4 font-label text-xs uppercase tracking-[0.2em] hover:bg-stone-200 transition-colors disabled:opacity-50"
            >
              {status === 'submitting' ? 'Sending\u2026' : 'Submit Inquiry'}
            </button>
          </form>
        )}
      </aside>
    </>
  )
}
