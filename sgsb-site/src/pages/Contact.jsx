import { Clock, Phone } from 'lucide-react'
import PageHero from '../components/PageHero'
import { ContactForm, OfficeList } from '../components/Contact'
import { Reveal, usePageMeta } from '../components/ui'
import { firm } from '../data/firm'

export default function ContactPage() {
  usePageMeta('Contact', 'Contact Stegmeier, Gelbart, Schwartz & Benavente — Orange County office in Irvine and San Diego County office downtown. (949) 337-4050.')
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s talk about"
        highlight="your legal needs."
        text="Your first call to SGSB will be to schedule a consultation with the attorney of your choice. We are offering remote consultations."
        image="/images/site/Sgsb-About-1-1024x512.jpg"
        crumbs={[{ label: 'Contact' }]}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <a href={firm.phoneHref} className="flex items-center gap-3 font-serif text-2xl font-bold text-sand hover:text-white">
            <Phone className="size-5" aria-hidden="true" /> {firm.phone}
          </a>
          <span className="flex items-center gap-2 text-sm text-white/70"><Clock className="size-4 text-sand" aria-hidden="true" /> {firm.hoursShort}</span>
        </div>
      </PageHero>

      <section className="section bg-cream">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="text-[2rem] leading-tight font-bold text-ink md:text-[2.4rem]">{firm.name}</h2>
              <p className="mt-4 text-muted">Two offices serving clients throughout Southern California.</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <OfficeList />
            </Reveal>
            <Reveal delay={0.15} className="mt-10 bg-ink p-7 text-white">
              <p className="eyebrow text-sand">Office hours</p>
              {firm.hours.map((h) => <p key={h} className="mt-2 text-white/80">{h}</p>)}
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="mb-6 text-2xl font-bold text-ink">Request a consultation</h2>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map */}
      <section aria-label="Office map" className="bg-paper">
        <div className="shell grid gap-5 py-16 md:grid-cols-2 lg:py-20">
          {firm.offices.map((o) => (
            <figure key={o.name} className="bg-white ring-1 ring-line">
              <iframe
                title={`Map of ${o.name}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(o.lines.join(', '))}&z=15&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block aspect-[16/10] w-full grayscale-[60%]"
              />
              <figcaption className="flex items-center justify-between gap-4 p-5">
                <span className="font-serif font-bold text-ink">{o.name}</span>
                <a href={o.map} target="_blank" rel="noreferrer" className="link-underline text-sm font-semibold text-crimson">Directions</a>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  )
}
