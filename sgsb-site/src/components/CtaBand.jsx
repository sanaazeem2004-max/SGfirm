import { Phone } from 'lucide-react'
import { firm } from '../data/firm'
import { Button, Reveal } from './ui'

/** Closing call-to-action used at the bottom of inner pages. */
export default function CtaBand({ title = 'Facing a family law matter?', accent = 'Speak with an experienced attorney.', text }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <img src="/images/site/New-Slide-background.jpg" alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover opacity-30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/95 to-ink/70" />
      <div className="shell section grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <h2 className="text-[2rem] leading-[1.15] font-bold md:text-[2.6rem]">
            {title} <span className="text-sand">{accent}</span>
          </h2>
          <p className="mt-5 max-w-xl text-white/70">
            {text ??
              'Your first call to SGSB will be to schedule a consultation with the attorney of your choice. We are offering remote consultations.'}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-4 sm:flex-row lg:justify-end">
          <Button to="/contact">Book a Consultation</Button>
          <a href={firm.phoneHref} className="inline-flex items-center justify-center gap-2 px-5 py-3.5 font-medium ring-1 ring-white/30 ring-inset transition-colors hover:bg-white/10">
            <Phone className="size-4 text-sand" aria-hidden="true" /> {firm.phone}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
