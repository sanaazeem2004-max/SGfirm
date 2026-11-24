import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Phone, Clock, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react'
import { firm } from '../data/firm'
import { Button, Reveal, SectionHeading } from './ui'

const STATES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

const DISCLAIMER =
  'The use of the internet or this form for communication with SGSB or any individual member of the firm does not establish an attorney-client relationship. Confidential or time-sensitive information should not be sent through this form.'

// Optional: set VITE_CONTACT_ENDPOINT to a form backend (e.g. the firm's
// existing form handler, Formspree, a serverless function). Payload is JSON.
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT

const initial = { first: '', last: '', email: '', phone: '', state: 'California', zip: '', prefEmail: false, prefPhone: false, message: '', agree: false, company: '' }

function validate(v) {
  const e = {}
  if (!v.first.trim()) e.first = 'Please enter your first name.'
  if (!v.last.trim()) e.last = 'Please enter your last name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) e.email = 'Please enter a valid email address.'
  if (v.phone.replace(/\D/g, '').length < 10) e.phone = 'Please enter a 10-digit phone number.'
  if (v.zip && !/^\d{5}(-\d{4})?$/.test(v.zip)) e.zip = 'ZIP code should be 5 digits.'
  if (v.message.trim().length < 10) e.message = 'Please briefly describe your legal issue.'
  if (!v.agree) e.agree = 'Please confirm you have read the disclaimer.'
  return e
}

function Field({ id, label, error, required, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[0.8rem] font-semibold tracking-wide text-ink">
        {label} {required && <span className="text-crimson" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs text-crimson">
          <AlertCircle className="size-3.5" aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  )
}

const inputCls = (err) =>
  `w-full border bg-white px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-stone/60 focus:border-navy ${err ? 'border-crimson' : 'border-line'}`

export function ContactForm() {
  const [v, setV] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | unavailable | error

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setV((s) => ({ ...s, [k]: val }))
    if (errors[k]) setErrors((s) => ({ ...s, [k]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (v.company) return // honeypot
    const errs = validate(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0])?.focus()
      return
    }
    setStatus('sending')
    const payload = {
      name: `${v.first} ${v.last}`.trim(),
      email: v.email,
      phone: v.phone,
      state: v.state,
      zip: v.zip,
      contactPreferences: [v.prefEmail && 'Email', v.prefPhone && 'Phone'].filter(Boolean),
      message: v.message,
      disclaimerAccepted: v.agree,
    }
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        if (!res.ok) throw new Error(String(res.status))
        setStatus('sent')
      } else if (import.meta.env.DEV) {
        console.info('[contact form] No VITE_CONTACT_ENDPOINT set — submission captured locally:', payload)
        await new Promise((r) => setTimeout(r, 700))
        setStatus('sent')
      } else {
        setStatus('unavailable')
      }
      if (ENDPOINT || import.meta.env.DEV) setV(initial)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="relative bg-white p-6 shadow-[0_30px_60px_-30px_rgba(19,24,38,0.25)] ring-1 ring-line sm:p-8 lg:p-10">
      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div key="sent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex min-h-[420px] flex-col items-start justify-center" role="status">
            <CheckCircle2 className="size-12 text-crimson" aria-hidden="true" />
            <h3 className="mt-6 text-3xl font-bold text-ink">Thank you.</h3>
            <p className="mt-3 max-w-md text-muted">
              Your message has been received. A member of our team will be in touch. For anything time-sensitive, please call{' '}
              <a href={firm.phoneHref} className="font-semibold text-navy underline">{firm.phone}</a>.
            </p>
            {import.meta.env.DEV && !ENDPOINT && (
              <p className="mt-4 bg-cream px-3 py-2 text-xs text-stone">Development mode: no form endpoint configured — the submission was logged to the console.</p>
            )}
            <button onClick={() => setStatus('idle')} className="link-underline mt-8 text-sm font-semibold text-crimson">Send another message</button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-label="Consultation request form">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="first" label="First name" required error={errors.first}>
                <input id="first" autoComplete="given-name" value={v.first} onChange={set('first')} className={inputCls(errors.first)} aria-invalid={!!errors.first} aria-describedby={errors.first ? 'first-error' : undefined} />
              </Field>
              <Field id="last" label="Last name" required error={errors.last}>
                <input id="last" autoComplete="family-name" value={v.last} onChange={set('last')} className={inputCls(errors.last)} aria-invalid={!!errors.last} aria-describedby={errors.last ? 'last-error' : undefined} />
              </Field>
              <Field id="email" label="Email" required error={errors.email}>
                <input id="email" type="email" autoComplete="email" value={v.email} onChange={set('email')} className={inputCls(errors.email)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
              </Field>
              <Field id="phone" label="Phone" required error={errors.phone}>
                <input id="phone" type="tel" autoComplete="tel" value={v.phone} onChange={set('phone')} className={inputCls(errors.phone)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : undefined} />
              </Field>
              <Field id="state" label="State">
                <select id="state" value={v.state} onChange={set('state')} className={inputCls(false)}>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field id="zip" label="ZIP code" error={errors.zip}>
                <input id="zip" inputMode="numeric" autoComplete="postal-code" value={v.zip} onChange={set('zip')} className={inputCls(errors.zip)} aria-invalid={!!errors.zip} aria-describedby={errors.zip ? 'zip-error' : undefined} />
              </Field>
              <fieldset className="sm:col-span-2">
                <legend className="mb-2 text-[0.8rem] font-semibold tracking-wide text-ink">How would you like to be contacted?</legend>
                <div className="flex gap-6">
                  {[['prefEmail', 'Email'], ['prefPhone', 'Phone']].map(([k, l]) => (
                    <label key={k} className="flex cursor-pointer items-center gap-2.5 text-[0.95rem] text-muted">
                      <input type="checkbox" checked={v[k]} onChange={set(k)} className="size-4 accent-crimson" /> {l}
                    </label>
                  ))}
                </div>
              </fieldset>
              <Field id="message" label="How can we help? Brief description of legal issue" required error={errors.message} className="sm:col-span-2">
                <textarea id="message" rows={5} value={v.message} onChange={set('message')} className={`${inputCls(errors.message)} resize-y`} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />
              </Field>
              {/* honeypot */}
              <div className="hidden" aria-hidden="true">
                <label>Company <input tabIndex={-1} autoComplete="off" value={v.company} onChange={set('company')} /></label>
              </div>
              <div className="sm:col-span-2">
                <p className="bg-cream p-4 text-xs leading-relaxed text-stone"><strong className="text-ink">Disclaimer:</strong> {DISCLAIMER}</p>
                <label htmlFor="agree" className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-ink">
                  <input id="agree" type="checkbox" checked={v.agree} onChange={set('agree')} className="size-4 accent-crimson" aria-invalid={!!errors.agree} aria-describedby={errors.agree ? 'agree-error' : undefined} />
                  I have read the disclaimer. <span className="text-crimson" aria-hidden="true">*</span>
                </label>
                {errors.agree && <p id="agree-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-crimson"><AlertCircle className="size-3.5" aria-hidden="true" /> {errors.agree}</p>}
              </div>
            </div>
            {(status === 'error' || status === 'unavailable') && (
              <p role="alert" className="mt-6 flex items-start gap-2 bg-crimson/10 p-4 text-sm text-crimson">
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {status === 'error' ? 'Something went wrong sending your message.' : 'Online submissions are temporarily unavailable.'} Please call us at {firm.phone}.
              </p>
            )}
            <div className="mt-8">
              <Button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Submit Request'}</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export function OfficeList({ dark = false }) {
  return (
    <div className="space-y-8">
      {firm.offices.map((o) => (
        <div key={o.name} className={`border-l-2 pl-5 ${dark ? 'border-sand' : 'border-crimson'}`}>
          <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-ink'}`}>{o.name}</h3>
          <address className={`mt-2 not-italic leading-relaxed ${dark ? 'text-white/70' : 'text-muted'}`}>
            {o.lines.map((l) => <span key={l} className="block">{l}</span>)}
          </address>
          <p className={`mt-2 text-sm ${dark ? 'text-white/50' : 'text-stone'}`}>{o.note}</p>
          <a href={o.map} target="_blank" rel="noreferrer" className={`link-underline mt-3 inline-flex items-center gap-1.5 text-sm font-semibold ${dark ? 'text-sand' : 'text-crimson'}`}>
            Map &amp; Directions <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      ))}
    </div>
  )
}

/** Home-page contact section */
export default function Contact() {
  return (
    <section id="contact" className="section bg-cream">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading eyebrow="Contact" title="Let’s Talk About" accent="Your Legal Needs." text="Schedule a consultation with the attorney of your choice. The initial meeting covers your rights and obligations and what to expect next." />
          <Reveal delay={0.1} className="mt-10 space-y-4">
            <a href={firm.phoneHref} className="flex items-center gap-4 bg-ink p-5 text-white transition-colors hover:bg-navy">
              <span className="grid size-11 place-items-center bg-crimson"><Phone className="size-5" aria-hidden="true" /></span>
              <span>
                <span className="block text-xs tracking-wide text-white/60 uppercase">{firm.remote}</span>
                <span className="font-serif text-xl font-bold">{firm.phone}</span>
              </span>
            </a>
            <div className="flex items-center gap-4 bg-white p-5 ring-1 ring-line">
              <span className="grid size-11 place-items-center bg-cream"><Clock className="size-5 text-crimson" aria-hidden="true" /></span>
              <span className="text-sm text-muted">{firm.hours.join(' ')}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {firm.offices.map((o) => (
                <div key={o.name} className="flex gap-3 bg-white p-5 text-sm ring-1 ring-line">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-crimson" aria-hidden="true" />
                  <span className="text-muted"><span className="block font-semibold text-ink">{o.name}</span>{o.lines.join(', ')}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
