import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import { ArticleCard } from '../components/Insights'
import { Reveal, SectionHeading, usePageMeta } from '../components/ui'
import { articles, news } from '../data'

export default function NewsPage() {
  usePageMeta('News & Recognition', news.intro[0])
  const [year, setYear] = useState(news.years[0].year)
  const current = news.years.find((y) => y.year === year)

  return (
    <>
      <PageHero
        eyebrow="News & recognition"
        title="Leaders in the California"
        highlight="family law community."
        text={news.intro.join(' ')}
        image="/images/site/AAML.jpg"
        crumbs={[{ label: 'News' }]}
      />

      <section className="section bg-paper">
        <div className="shell">
          <SectionHeading eyebrow="Articles" title="Insights from" accent="our attorneys." />
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {articles.map((a, i) => <ArticleCard key={a.slug} a={a} index={i} />)}
          </ul>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-4">
            <div>
              <SectionHeading eyebrow="Firm news" title="Activities, recognitions" accent="& speaking engagements." />
              <Reveal delay={0.1} className="mt-8">
                <p className="mb-3 text-sm font-semibold text-ink" id="year-label">Select a year</p>
                {/* Mobile: swipeable row. lg: vertical list with entry counts. */}
                <div
                  role="tablist"
                  aria-labelledby="year-label"
                  className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-line"
                >
                  {news.years.map((y) => {
                    const count = y.entries.reduce((n, e) => n + e.items.length, 0)
                    const on = year === y.year
                    return (
                      <button
                        key={y.year}
                        role="tab"
                        aria-selected={on}
                        onClick={() => setYear(y.year)}
                        className={`relative flex shrink-0 items-center justify-between gap-6 px-4 py-2.5 text-sm font-semibold transition-colors lg:border-b lg:border-line lg:px-4 lg:py-3 ${on ? 'text-white' : 'bg-white text-ink ring-1 ring-line hover:text-crimson lg:bg-transparent lg:ring-0'}`}
                      >
                        {on && <motion.span layoutId="year-pill" className="absolute inset-0 bg-crimson" />}
                        <span className="relative font-serif text-base">{y.year}</span>
                        <span className={`relative hidden text-xs font-normal lg:inline ${on ? 'text-white/80' : 'text-stone'}`}>
                          {count} {count === 1 ? 'item' : 'items'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Reveal>
            </div>
          </div>
          <div className="lg:col-span-8" role="tabpanel" aria-label={`News from ${year}`}>
            <AnimatePresence mode="wait">
              <motion.ol
                key={year}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="relative border-l border-line pl-8"
              >
                {current.entries.map((e) => (
                  <li key={e.label} className="relative pb-10 last:pb-0">
                    <span aria-hidden="true" className="absolute top-1.5 -left-[38px] size-[11px] border-2 border-crimson bg-cream" />
                    <h3 className="font-serif text-xl font-bold text-navy">{e.label}</h3>
                    <div className="mt-4 space-y-3">
                      {e.items.map((it) => (
                        <p key={it.slice(0, 40)} className="bg-white p-5 text-[0.95rem] leading-relaxed text-muted ring-1 ring-line">{it}</p>
                      ))}
                    </div>
                  </li>
                ))}
              </motion.ol>
            </AnimatePresence>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
