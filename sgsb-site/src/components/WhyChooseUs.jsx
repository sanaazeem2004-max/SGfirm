import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Users, MessageCircle, Handshake, Building2, Gavel, Search, Plus, Minus } from 'lucide-react'
import { pillars, approach } from '../data/firm'
import { Button, Reveal, RevealImage, SectionHeading } from './ui'

const icons = [Users, MessageCircle, Handshake, Building2, Gavel, Search]

export default function WhyChooseUs() {
  return (
    <section className="section relative isolate overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_85%_10%,rgba(203,180,138,0.12),transparent)]" />
      <div className="shell">
        <SectionHeading
          dark
          align="center"
          eyebrow="Why choose SGSB"
          title="Settlement-minded counsel,"
          accent="built for the courtroom."
          text="SGSB’s attorneys are respected among the legal community as aggressive, effective, and successful trial lawyers who litigate their cases with credibility, integrity and reasonableness — and who exhaust every settlement possibility first."
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="relative lg:col-span-5">
            <RevealImage
              src="/images/site/AAML.jpg"
              alt="SGSB partners at the AAML Southern California Chapter awards, where Eleanor Stegmeier received the 2022 Family Law Person of the Year Award"
              className="aspect-[4/3] w-full lg:aspect-auto lg:h-full"
            />
            <div className="absolute bottom-0 left-0 max-w-[85%] bg-cream p-5 text-ink sm:p-6">
              <p className="font-serif text-lg leading-snug font-bold">2022 Family Law Person of the Year</p>
              <p className="mt-1 text-xs text-stone">Eleanor Stegmeier · AAML Southern California Chapter</p>
            </div>
          </div>
          {/* Mobile: swipeable snap row. sm+: 2-column grid. */}
          <ul className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-px sm:overflow-visible sm:bg-white/10 sm:px-0 sm:pb-0 lg:col-span-7" aria-label="Why clients choose SGSB">
            {pillars.map((p, i) => {
              const Icon = icons[i]
              return (
                <Reveal as="li" key={p.title} delay={(i % 2) * 0.08} className="group w-[78%] shrink-0 snap-start bg-ink-2 p-6 ring-1 ring-white/10 transition-colors duration-500 hover:bg-ink-2 sm:w-auto sm:bg-ink sm:p-7 sm:ring-0 lg:p-8">
                  <Icon className="size-6 text-sand transition-transform duration-500 group-hover:-translate-y-1" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-bold">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{p.text}</p>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** "How it works" — interactive step list over photography (Veritas step boxes). */
export function Process() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section bg-paper">
      <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Becoming a client" title="A clear path," accent="from first call to resolution." />
          <ol className="mt-10 space-y-2">
            {approach.map((s, i) => {
              const isOpen = open === i
              return (
                <li key={s.step}>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-300 ${isOpen ? 'bg-ink text-white' : 'bg-cream text-ink hover:bg-line/60'}`}
                  >
                    <span className={`eyebrow w-14 shrink-0 ${isOpen ? 'text-sand' : 'text-crimson'}`}>{s.step}</span>
                    <span className="flex-1 font-serif text-lg font-bold">{s.title}</span>
                    {isOpen ? <Minus className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="border-l-2 border-crimson bg-white px-5 py-4 text-[0.95rem] leading-relaxed text-muted">{s.text}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ol>
          <Reveal className="mt-10">
            <Button to="/contact">Schedule a Consultation</Button>
          </Reveal>
        </div>
        <div className="relative isolate lg:col-span-7">
          <RevealImage src="/images/site/About-join.jpg" alt="Attorneys meeting outside a courthouse colonnade" className="aspect-[4/3] w-full lg:aspect-[7/6]" />
          <div aria-hidden="true" className="absolute -bottom-4 -left-4 -z-10 hidden size-40 border-2 border-sand lg:block" />
        </div>
      </div>
    </section>
  )
}
