import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import { AttorneyCard } from '../components/Attorneys'
import { Reveal, usePageMeta } from '../components/ui'
import { attorneys, attorneyGroups } from '../data'
import { teamIntro } from '../data/firm'

export default function AttorneysPage() {
  usePageMeta('Attorneys', teamIntro)
  const [group, setGroup] = useState('All')
  const [q, setQ] = useState('')

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase()
    return attorneys.filter((a) => (group === 'All' || a.group === group) && (!term || `${a.name} ${a.title}`.toLowerCase().includes(term)))
  }, [group, q])

  return (
    <>
      <PageHero
        eyebrow="Our attorneys"
        title="Choosing the right family law attorney is a very important"
        highlight="personal decision."
        text={teamIntro}
        image="/images/site/team-photo-1.jpg"
        crumbs={[{ label: 'Attorneys' }]}
      />

      <section className="section bg-cream">
        <div className="shell">
          <Reveal>
            <p className="max-w-3xl text-[1.0625rem] leading-relaxed text-muted">
              In addition to our exceptional credentials and accolades, SGSB attorneys are as diverse as our clientele. Our partners and
              associates possess many unique characteristics that enable our firm to provide the best representation for our clients.
              Learn more about each attorney on their individual biography page.
            </p>
            <div className="mt-10 flex flex-col gap-3 border-y border-line py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter attorneys">
                {['All', ...attorneyGroups].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGroup(g)}
                    aria-pressed={group === g}
                    className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${group === g ? 'text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'}`}
                  >
                    {group === g && <motion.span layoutId="att-filter" className="absolute inset-0 bg-ink" />}
                    <span className="relative">{g}</span>
                  </button>
                ))}
              </div>
              <label className="relative block md:w-64">
                <span className="sr-only">Search attorneys by name</span>
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone" aria-hidden="true" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name" className="w-full border border-line bg-white py-2.5 pr-3 pl-10 text-sm outline-none focus:border-navy" />
              </label>
            </div>
          </Reveal>

          {attorneyGroups.map((g) => {
            const list = visible.filter((a) => a.group === g)
            if (!list.length) return null
            return (
              <div key={g} className="mt-14 first-of-type:mt-14">
                <div className="mb-6 flex items-baseline justify-between border-b border-line pb-4">
                  <h2 className="text-2xl font-bold text-ink md:text-3xl">{g}</h2>
                  <span className="text-sm text-stone">{list.length} {list.length === 1 ? 'attorney' : 'attorneys'}</span>
                </div>
                <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                  {list.map((a, i) => <AttorneyCard key={a.slug} a={a} index={i} />)}
                </ul>
              </div>
            )
          })}
          {visible.length === 0 && <p className="mt-14 bg-white py-16 text-center text-muted ring-1 ring-line">No attorneys match “{q}”.</p>}
        </div>
      </section>
      <CtaBand title="Schedule a consultation" accent="with the attorney of your choice." />
    </>
  )
}
