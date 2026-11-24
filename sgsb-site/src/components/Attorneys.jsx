import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { partners } from '../data'
import { teamIntro } from '../data/firm'
import { Button, Reveal, SectionHeading } from './ui'

export function AttorneyCard({ a, index = 0, priority = false }) {
  return (
    <motion.li
      className="h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/attorneys/${a.slug}`} className="group flex h-full flex-col bg-white ring-1 ring-line transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_28px_44px_-22px_rgba(19,24,38,0.55)]" aria-label={`${a.name}, ${a.title}`}>
        <span className="relative block aspect-[3/4] overflow-hidden bg-cream">
          <img
            src={a.image}
            alt={`Portrait of ${a.name}`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="size-full object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </span>
        <span className="flex flex-1 items-stretch">
          <span className="flex-1 px-4 py-4">
            <span className="block font-serif text-[1.02rem] leading-snug font-bold text-ink transition-colors duration-300 group-hover:text-crimson">{a.name}</span>
            <span className="mt-1 block text-[0.8rem] text-stone">{a.title}</span>
          </span>
          <span aria-hidden="true" className="grid w-11 shrink-0 place-items-center bg-navy text-white transition-colors duration-300 group-hover:bg-crimson">
            <Plus className="size-4 transition-transform duration-500 group-hover:rotate-90" />
          </span>
        </span>
      </Link>
    </motion.li>
  )
}

export default function Attorneys() {
  return (
    <section className="section bg-cream">
      <div className="shell">
        <div className="grid items-end gap-8 lg:grid-cols-2 lg:gap-16">
          <SectionHeading eyebrow="Our attorneys" title="Respected family law practitioners," accent="handling your matter personally." />
          <Reveal delay={0.1}>
            <p className="text-[1.0625rem] leading-relaxed text-muted">{teamIntro}</p>
            <div className="mt-7">
              <Button to="/attorneys" tone="navy">Meet All 14 Attorneys</Button>
            </div>
          </Reveal>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:mt-16 lg:gap-5 xl:grid-cols-6">
          {partners.map((a, i) => (
            <AttorneyCard key={a.slug} a={a} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
