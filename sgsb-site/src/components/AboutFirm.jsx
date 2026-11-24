import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { stats } from '../data/firm'
import { Button, CountUp, Reveal, RevealImage, SectionHeading } from './ui'

const EASE = [0.22, 1, 0.36, 1]

const points = [
  'Founded in 1995 by Eleanor Stegmeier and Saul Gelbart',
  'Five lawyers admitted as Fellows of the American Academy of Matrimonial Lawyers',
  'A partner, associate attorney and paralegal assigned to every case',
]

export function Stats({ dark = false }) {
  const line = dark ? 'bg-white/15' : 'bg-line'
  return (
    <div className="relative">
      {/* top rule draws across */}
      <motion.span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-px origin-left ${line}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <dl className="grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className={`group relative py-8 pr-4 ${['', 'pl-6 lg:pl-8', 'lg:pl-8', 'pl-6 lg:pl-8'][i]}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: EASE }}
          >
            {/* vertical divider grows downward */}
            {i > 0 && (
              <motion.span
                aria-hidden="true"
                className={`absolute top-0 left-0 h-full w-px origin-top ${line} ${i === 2 ? 'hidden lg:block' : ''}`}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: EASE }}
              />
            )}
            {i > 1 && <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-px lg:hidden ${line}`} />}
            {/* hover accent bar */}
            <span aria-hidden="true" className={`absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-16 ${dark ? 'bg-sand' : 'bg-crimson'} ${['', 'ml-6 lg:ml-8', 'lg:ml-8', 'ml-6 lg:ml-8'][i]}`} />
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <CountUp
                value={s.value}
                className={`block font-serif text-4xl font-bold tabular-nums transition-transform duration-500 group-hover:-translate-y-1 lg:text-5xl ${dark ? 'text-sand' : 'text-navy'}`}
              />
              <span className={`mt-2 block text-sm leading-snug ${dark ? 'text-white/60' : 'text-muted'}`}>{s.label}</span>
            </dd>
          </motion.div>
        ))}
      </dl>
    </div>
  )
}

export default function AboutFirm() {
  return (
    <section className="section bg-paper">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative isolate">
            <RevealImage
              src="/images/site/Sgsb-About-1-1024x512.jpg"
              alt="SGSB attorneys reviewing a case outside the office"
              className="aspect-[4/3] w-full lg:aspect-[5/6]"
              imgClassName="object-[32%_center]"
            />
            {/* decorative frame slides into place */}
            <motion.span
              aria-hidden="true"
              className="absolute -top-4 -left-4 -z-10 hidden size-32 border-2 border-sand lg:block"
              initial={{ opacity: 0, x: 24, y: 24 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6, ease: EASE }}
            />
            <motion.div
              className="absolute right-0 bottom-0"
              initial={{ opacity: 0, scale: 0.6, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 140, damping: 14, delay: 0.5 }}
            >
              <motion.div
                className="bg-white px-6 py-5 shadow-xl sm:px-8 sm:py-6"
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              >
                <CountUp value="1995" className="block font-serif text-4xl font-bold text-crimson tabular-nums sm:text-5xl" />
                <span className="eyebrow mt-1 block text-ink">Established</span>
                <motion.span
                  aria-hidden="true"
                  className="mt-3 block h-[3px] origin-left bg-crimson"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 1, ease: EASE }}
                />
              </motion.div>
            </motion.div>
          </div>
          <div>
            <SectionHeading eyebrow="About the firm" title="Family law is all we do —" accent="and we have done it for three decades." />
            <Reveal delay={0.1} className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-muted">
              <p>
                With 14 attorneys, Stegmeier, Gelbart, Schwartz &amp; Benavente is one of the largest law firms in Orange County whose
                practice is devoted exclusively to family law. Ten of our attorneys are Board Certified by the State of California as
                Family Law Specialists.
              </p>
              <p>
                SGSB’s attorneys manage each case with goals of efficiency, practicality, and preparedness — settlement-minded at the
                outset, and fully prepared for trial when litigation becomes the only viable option.
              </p>
            </Reveal>
            <ul className="mt-7 space-y-3">
              {points.map((p, i) => (
                <motion.li
                  key={p}
                  className="group flex gap-3 text-[0.95rem] text-ink"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: EASE }}
                >
                  <motion.span
                    className="mt-0.5 grid size-5 shrink-0 place-items-center bg-crimson text-white transition-transform duration-300 group-hover:rotate-12"
                    initial={{ scale: 0, rotate: -90 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.35 + i * 0.15 }}
                  >
                    <Check className="size-3" aria-hidden="true" />
                  </motion.span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">{p}</span>
                </motion.li>
              ))}
            </ul>
            <Reveal delay={0.3} className="mt-9">
              <Button to="/about" tone="navy">Our Story</Button>
            </Reveal>
          </div>
        </div>
        <div className="mt-16 lg:mt-24">
          <Stats />
        </div>
      </div>
    </section>
  )
}
