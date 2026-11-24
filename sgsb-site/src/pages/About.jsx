import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Award } from 'lucide-react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import Recognition from '../components/Recognition'
import { Stats } from '../components/AboutFirm'
import { Process } from '../components/WhyChooseUs'
import { Button, Reveal, RevealImage, SectionHeading, usePageMeta } from '../components/ui'
import { welcomeLetter, distinctions, timeline } from '../data/firm'

function TimelineLine({ target }) {
  const { scrollYProgress } = useScroll({ target, offset: ['start 75%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })
  return (
    <>
      <span aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-px bg-line md:left-1/2" />
      <motion.span aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-[2px] origin-top bg-crimson md:left-1/2 md:-translate-x-[0.5px]" style={{ scaleY }} />
    </>
  )
}

export default function About() {
  const timelineRef = useRef(null)
  usePageMeta('About the Firm', 'Founded in 1995 by Eleanor Stegmeier and Saul Gelbart, SGSB is one of the largest law firms in Orange County devoted exclusively to family law.')
  return (
    <>
      <PageHero
        eyebrow="About SGSB"
        title="Three decades devoted"
        highlight="exclusively to family law."
        text="Founded in 1995 by Eleanor Stegmeier and Saul Gelbart, Stegmeier, Gelbart, Schwartz & Benavente has grown to 14 lawyers serving clients from offices in Orange County and San Diego County."
        image="/images/site/New-Slide-background.jpg"
        crumbs={[{ label: 'About' }]}
      />

      {/* Welcome letter */}
      <section className="section bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <RevealImage src="/images/attorneys/saul-m-gelbart.jpg" alt="Saul M. Gelbart, Managing Partner and Founder" className="aspect-[4/5] w-full" imgClassName="object-top" />
              <div className="flex items-center justify-between bg-ink px-6 py-5 text-white">
                <span>
                  <span className="block font-serif text-lg font-bold">Saul M. Gelbart</span>
                  <span className="text-sm text-white/60">Managing Partner / Founder</span>
                </span>
                <Award className="size-6 text-sand" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="A welcome from our managing partner" title="“If you think that we may be of service," accent="please do not hesitate to call.”" />
            <Reveal delay={0.1} className="prose-sgsb mt-8">
              {welcomeLetter.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 font-serif text-2xl text-navy italic">Saul Gelbart</p>
            </Reveal>
            <div className="mt-14">
              <Stats />
            </div>
          </div>
        </div>
      </section>

      {/* Distinctions */}
      <section className="section bg-ink text-white">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading dark eyebrow="Special distinctions" title="Recognised" accent="individually and as a firm." text="Individually and as a firm, the SGSB team has amassed many special distinctions and accolades." />
          </div>
          <ol className="grid gap-px bg-white/10 sm:grid-cols-2 lg:col-span-8">
            {distinctions.map((d, i) => (
              <Reveal as="li" key={i} delay={(i % 2) * 0.06} className="flex gap-5 bg-ink p-6 lg:p-7">
                <span className="font-serif text-sm font-bold text-sand">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-[0.95rem] leading-relaxed text-white/75">{d}</p>
              </Reveal>
            ))}
            {distinctions.length % 2 === 1 && <li aria-hidden="true" className="hidden bg-ink sm:block" />}
          </ol>
        </div>
      </section>

      <Process />

      {/* Timeline */}
      <section className="section bg-cream">
        <div className="shell">
          <SectionHeading eyebrow="Our history" title="From two founders" accent="to fourteen attorneys." align="center" />
          <ol ref={timelineRef} className="relative mx-auto mt-14 max-w-4xl lg:mt-20">
            <TimelineLine target={timelineRef} />
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.year + i} className={`relative grid pb-10 pl-10 last:pb-0 md:grid-cols-2 md:gap-16 md:pl-0`}>
                <motion.span
                  aria-hidden="true"
                  className="absolute top-1.5 left-0 z-10 size-[15px] border-2 border-crimson bg-cream md:left-1/2 md:-ml-[7.5px]"
                  initial={{ scale: 0, rotate: 45 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                />
                <div className={`${i % 2 === 0 ? 'md:text-right' : 'md:col-start-2'}`}>
                  <span className="font-serif text-3xl font-bold text-navy">{t.year}</span>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-14 flex justify-center">
            <Button to="/attorneys" tone="navy">Meet Our Attorneys</Button>
          </Reveal>
        </div>
      </section>

      <Recognition />
      <CtaBand />
    </>
  )
}
