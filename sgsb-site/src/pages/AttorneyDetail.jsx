import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, GraduationCap, Award, Users, Scale, BookOpen, Languages, Landmark, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react'
import CtaBand from '../components/CtaBand'
import { Button, Reveal, usePageMeta } from '../components/ui'
import { attorneys, getAttorney, bioLead } from '../data'
import { firm } from '../data/firm'

const iconFor = (h) =>
  /Education/i.test(h) ? GraduationCap :
  /Honors|Awards/i.test(h) ? Award :
  /Associations|Memberships/i.test(h) ? Users :
  /Bar/i.test(h) ? Landmark :
  /Published|Classes|Seminars/i.test(h) ? BookOpen :
  /Languages/i.test(h) ? Languages :
  /Specialt|Practice|Litigation/i.test(h) ? Scale : Briefcase

const QUICK = ['Bar Admissions', 'Certified Legal Specialties', 'Areas of Practice', 'Litigation Percentage', 'Languages']

export default function AttorneyDetail() {
  const { slug } = useParams()
  const a = getAttorney(slug)
  usePageMeta(a ? `${a.name}, ${a.title}` : null, a ? bioLead(a) : null)
  if (!a) return <Navigate to="/attorneys" replace />

  const bio = a.sections.filter((s) => s.paragraphs.length)
  const quick = a.sections.filter((s) => QUICK.includes(s.heading) && s.items.length)
  const lists = a.sections.filter((s) => !s.paragraphs.length && !QUICK.includes(s.heading) && s.items.length)
  const i = attorneys.indexOf(a)
  const prev = attorneys[(i - 1 + attorneys.length) % attorneys.length]
  const next = attorneys[(i + 1) % attorneys.length]
  const first = a.name.split(' ')[0]

  return (
    <>
      {/* Profile hero */}
      <section className="relative isolate overflow-hidden bg-ink pt-[130px] text-white lg:pt-[170px]">
        <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 bg-[repeating-linear-gradient(90deg,transparent_0_22px,rgba(255,255,255,0.03)_22px_23px)] lg:block" />
        <div className="shell grid items-end gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="pb-12 lg:col-span-7 lg:pb-20">
            <nav aria-label="Breadcrumb" className="mb-8 text-xs text-white/55">
              <Link to="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span>{' '}
              <Link to="/attorneys" className="hover:text-white">Attorneys</Link> <span aria-hidden="true">/</span>{' '}
              <span className="text-white/80">{a.name}</span>
            </nav>
            <motion.p className="eyebrow flex items-center gap-3 text-sand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <span aria-hidden="true" className="h-px w-8 bg-sand" /> {a.title}
            </motion.p>
            <motion.h1
              className="mt-5 text-[2.6rem] leading-[1.08] font-bold tracking-tight md:text-6xl lg:text-[4.25rem]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {a.name}
            </motion.h1>
            <motion.p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-white/70" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
              {bioLead(a)}
            </motion.p>
            {quick.length > 0 && (
              <motion.dl className="mt-9 grid gap-px bg-white/10 sm:grid-cols-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                {quick.slice(0, 4).map((s) => (
                  <div key={s.heading} className="bg-ink py-4 pr-4 sm:odd:pr-6 sm:even:pl-6">
                    <dt className="eyebrow text-[0.65rem] text-sand">{s.heading}</dt>
                    <dd className="mt-1.5 text-sm text-white/85">{s.items.join(' · ')}</dd>
                  </div>
                ))}
              </motion.dl>
            )}
            <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <Button to="/contact">Consult with {first}</Button>
              <a href={firm.phoneHref} className="inline-flex items-center justify-center gap-2 px-5 py-3.5 font-medium ring-1 ring-white/30 ring-inset hover:bg-white/10">
                <Phone className="size-4 text-sand" aria-hidden="true" /> {firm.phone}
              </a>
            </motion.div>
          </div>
          <motion.div
            className="relative lg:col-span-5"
            initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={a.image} alt={`Portrait of ${a.name}`} className="aspect-[4/5] w-full object-cover object-top" fetchPriority="high" />
            <span aria-hidden="true" className="absolute bottom-0 left-0 h-1.5 w-1/3 bg-crimson" />
          </motion.div>
        </div>
      </section>

      {/* Biography + credentials */}
      <section className="section bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <article className="lg:col-span-7">
            {bio.map((s) => (
              <Reveal key={s.heading} className="mb-12 last:mb-0">
                <h2 className="flex items-center gap-3 text-[1.9rem] font-bold text-ink">
                  <span aria-hidden="true" className="h-px w-8 bg-crimson" /> {s.heading}
                </h2>
                <div className="prose-sgsb mt-6">
                  {s.paragraphs.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
                </div>
              </Reveal>
            ))}
          </article>
          <aside className="space-y-5 lg:col-span-5">
            {lists.map((s, idx) => {
              const Icon = iconFor(s.heading)
              return (
                <Reveal key={s.heading} delay={Math.min(idx, 3) * 0.05} className="bg-white p-7 ring-1 ring-line">
                  <h2 className="flex items-center gap-3 text-lg font-bold text-ink">
                    <span className="grid size-9 place-items-center bg-cream text-crimson"><Icon className="size-4" aria-hidden="true" /></span>
                    {s.heading}
                  </h2>
                  <ul className="prose-sgsb mt-4 text-[0.92rem] leading-relaxed">
                    {s.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </Reveal>
              )
            })}
            {quick.length > 4 && (
              <div className="bg-white p-7 ring-1 ring-line">
                {quick.slice(4).map((s) => (
                  <p key={s.heading} className="text-sm text-muted"><strong className="text-ink">{s.heading}:</strong> {s.items.join(', ')}</p>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Prev / next */}
      <nav aria-label="More attorneys" className="border-t border-line bg-cream">
        <div className="shell grid grid-cols-2">
          <Link to={`/attorneys/${prev.slug}`} className="group flex items-center gap-4 py-8 pr-4">
            <ChevronLeft className="size-5 shrink-0 text-crimson transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            <img src={prev.image} alt="" loading="lazy" className="hidden size-14 object-cover object-top sm:block" />
            <span className="min-w-0">
              <span className="eyebrow block text-[0.65rem] text-stone">Previous</span>
              <span className="block truncate font-serif font-bold text-ink">{prev.name}</span>
            </span>
          </Link>
          <Link to={`/attorneys/${next.slug}`} className="group flex items-center justify-end gap-4 border-l border-line py-8 pl-4 text-right">
            <span className="min-w-0">
              <span className="eyebrow block text-[0.65rem] text-stone">Next</span>
              <span className="block truncate font-serif font-bold text-ink">{next.name}</span>
            </span>
            <img src={next.image} alt="" loading="lazy" className="hidden size-14 object-cover object-top sm:block" />
            <ChevronRight className="size-5 shrink-0 text-crimson transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </nav>
      <CtaBand title={`Schedule a consultation`} accent={`with ${a.name}.`} />
    </>
  )
}
