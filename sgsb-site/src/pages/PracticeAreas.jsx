import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import { PracticeCardLink } from '../components/PracticeAreas'
import { Reveal, usePageMeta } from '../components/ui'
import { practices } from '../data/practices'
import { firmOverview, serviceModes } from '../data/firm'
import { Link } from 'react-router-dom'

const filters = [
  { key: 'all', label: 'All areas' },
  { key: 'children', label: 'Children & parenting', slugs: ['child-custody-time', 'child-custody-requests', 'child-support', 'parentage'] },
  { key: 'divorce', label: 'Divorce & finances', slugs: ['dissolution', 'spousal-support', 'premarital-agreements', 'same-sex-relationships'] },
  { key: 'orders', label: 'Orders & protection', slugs: ['court-orders', 'domestic-violence'] },
  { key: 'options', label: 'Ways to work with us', slugs: ['mediation', 'limited-scope-representation'] },
]

export default function PracticeAreasPage() {
  usePageMeta('Practice Areas', 'Divorce, child custody, move-away requests, child and spousal support, parentage, domestic violence, premarital agreements, mediation and limited scope representation.')
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')

  const results = useMemo(() => {
    const f = filters.find((x) => x.key === filter)
    const term = q.trim().toLowerCase()
    return practices.filter((p) => {
      if (f.slugs && !f.slugs.includes(p.slug)) return false
      if (!term) return true
      return [p.title, p.summary, ...p.body, ...(p.items ?? [])].join(' ').toLowerCase().includes(term)
    })
  }, [q, filter])

  return (
    <>
      <PageHero
        eyebrow="Practice areas"
        title="Our Practice"
        highlight="Areas."
        text={firmOverview[0]}
        image="/images/site/Counter-Background-1024x462.jpg"
        crumbs={[{ label: 'Practice Areas' }]}
      />

      <section className="section bg-cream">
        <div className="shell">
          {/* Directory controls */}
          <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter practice areas">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  aria-pressed={filter === f.key}
                  className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${filter === f.key ? 'text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'}`}
                >
                  {filter === f.key && <motion.span layoutId="pa-filter" className="absolute inset-0 bg-ink" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} />}
                  <span className="relative">{f.label}</span>
                </button>
              ))}
            </div>
            <label className="relative block w-full lg:w-80">
              <span className="sr-only">Search practice areas</span>
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-stone" aria-hidden="true" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search practice areas"
                className="w-full border border-line bg-white py-3 pr-10 pl-11 text-[0.95rem] outline-none focus:border-navy"
              />
              {q && (
                <button onClick={() => setQ('')} className="absolute top-1/2 right-3 -translate-y-1/2 text-stone hover:text-ink" aria-label="Clear search">
                  <X className="size-4" />
                </button>
              )}
            </label>
          </Reveal>

          <p className="mt-8 text-sm text-stone" aria-live="polite">
            Showing {results.length} of {practices.length} practice areas
          </p>

          <motion.ul layout className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {results.map((p) => (
                <motion.li key={p.slug} layout className="h-full" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
                  <PracticeCardLink p={p} index={practices.indexOf(p)} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
          {results.length === 0 && (
            <p className="bg-white py-16 text-center text-muted ring-1 ring-line">
              No practice areas match “{q}”. <button onClick={() => { setQ(''); setFilter('all') }} className="font-semibold text-crimson underline">Reset filters</button>
            </p>
          )}
        </div>
      </section>

      {/* Ways to work with us */}
      <section className="section bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-4 flex items-center gap-3 text-crimson"><span aria-hidden="true" className="h-px w-8 bg-crimson" />Beyond the everyday</p>
              <h2 className="text-[2rem] leading-[1.12] font-bold md:text-[2.6rem]">Exceptional results <span className="text-stone">in less common matters.</span></h2>
              <p className="mt-6 text-[1.0625rem] leading-relaxed text-muted">{firmOverview[1]}</p>
            </Reveal>
          </div>
          <ul className="grid gap-px bg-line ring-1 ring-line lg:col-span-7">
            {serviceModes.map((m, i) => (
              <Reveal as="li" key={m.title} delay={i * 0.06} className="bg-white">
                <Link to={m.to} className="group flex items-start gap-6 p-7 transition-colors hover:bg-cream">
                  <span className="font-serif text-2xl font-bold text-crimson">0{i + 1}</span>
                  <span>
                    <span className="block font-serif text-xl font-bold text-ink">{m.title}</span>
                    <span className="mt-2 block text-[0.95rem] leading-relaxed text-muted">{m.text}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
