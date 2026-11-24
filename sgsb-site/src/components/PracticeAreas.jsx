import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { practices } from '../data/practices'
import { firmOverview } from '../data/firm'
import { Button, Reveal, SectionHeading } from './ui'

export function PracticeCard({ p, index = 0 }) {
  return (
    <motion.li
      className="h-full"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <PracticeCardLink p={p} index={index} />
    </motion.li>
  )
}

export function PracticeCardLink({ p, index = 0 }) {
  const Icon = p.icon
  return (
      <Link
        to={`/practice-areas/${p.slug}`}
        className="group relative flex h-full items-center gap-4 overflow-hidden bg-white p-4 ring-1 ring-line transition-[background-color,transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:bg-ink hover:shadow-[0_24px_40px_-20px_rgba(19,24,38,0.55)] focus-visible:bg-ink sm:flex-col sm:items-stretch sm:gap-0 sm:p-7"
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-crimson transition-transform duration-500 group-hover:scale-x-100" />
        <span className="flex shrink-0 items-start justify-between">
          <span className="grid size-11 place-items-center bg-cream text-navy transition-colors duration-500 group-hover:bg-crimson group-hover:text-white sm:size-12">
            <Icon className="size-5 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" aria-hidden="true" />
          </span>
          <span className="hidden font-serif text-sm text-stone/70 transition-colors group-hover:text-white/40 sm:inline">{String(index + 1).padStart(2, '0')}</span>
        </span>
        <h3 className="flex-1 text-[1.02rem] leading-snug font-bold text-ink transition-colors duration-500 group-hover:text-white sm:mt-7 sm:flex-none sm:text-[1.2rem]">{p.title}</h3>
        <ArrowRight className="size-4 shrink-0 text-crimson sm:hidden" aria-hidden="true" />
        <p className="mt-3 hidden flex-1 text-[0.92rem] leading-relaxed text-muted transition-colors duration-500 group-hover:text-white/70 sm:block">{p.summary}</p>
        <span className="mt-6 hidden items-center gap-2 text-sm font-semibold text-crimson transition-colors duration-500 group-hover:text-sand sm:inline-flex">
          Learn more <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
  )
}

export function PracticeGrid({ items = practices }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((p) => (
        <PracticeCard key={p.slug} p={p} index={practices.indexOf(p)} />
      ))}
    </ul>
  )
}

export default function PracticeAreas() {
  return (
    <section className="section bg-cream">
      <div className="shell">
        <div className="grid items-end gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading eyebrow="Practice areas" title="Counsel for every stage" accent="of a family law matter." />
          <Reveal delay={0.1}>
            <p className="text-[1.0625rem] leading-relaxed text-muted">{firmOverview[0].split(', ranging')[0]} — from simple divorce or post-Judgment matters to high-conflict custody disputes and multi-million dollar estates.</p>
          </Reveal>
        </div>
        <div className="mt-12 lg:mt-16">
          <PracticeGrid />
        </div>
        <Reveal className="mt-12 flex justify-center">
          <Button to="/practice-areas" tone="outline">Explore All Practice Areas</Button>
        </Reveal>
      </div>
    </section>
  )
}
