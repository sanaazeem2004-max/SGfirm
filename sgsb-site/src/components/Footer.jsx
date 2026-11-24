import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock } from 'lucide-react'
import { firm } from '../data/firm'
import { practices } from '../data/practices'
import { Logo, FacebookIcon, Reveal } from './ui'

const YEAR = new Date().getFullYear()

const firmLinks = [
  { label: 'About the Firm', to: '/about' },
  { label: 'Attorneys', to: '/attorneys' },
  { label: 'Practice Areas', to: '/practice-areas' },
  { label: 'News & Recognition', to: '/news' },
  { label: 'Contact', to: '/contact' },
]
const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms-conditions' },
  { label: 'Disclaimer', to: '/disclaimer' },
  { label: 'Accessibility Statement', to: '/accessibility-statement' },
]

function Col({ title, children, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <h2 className="eyebrow mb-5 font-sans text-sand">{title}</h2>
      {children}
    </Reveal>
  )
}

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-10 lg:py-20">
        <Reveal className="max-w-sm">
          <Logo light className="w-44" />
          <p className="mt-6 text-sm leading-relaxed text-white/60">
            Devoted exclusively to family law since 1995, with offices in Orange County and San Diego County.
          </p>
          <p className="mt-5 font-serif text-lg text-sand">{firm.tagline}</p>
          <a
            href={firm.facebook}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-grid size-10 place-items-center border border-white/20 text-white/80 transition-colors hover:border-sand hover:text-sand"
            aria-label="SGSB on Facebook"
          >
            <FacebookIcon className="size-4" />
          </a>
        </Reveal>

        <Col title="The Firm" delay={0.08}>
          <ul className="space-y-3 text-sm">
            {firmLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="link-underline text-white/70 hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </Col>

        <Col title="Practice Areas" delay={0.16}>
          <ul className="space-y-3 text-sm">
            {practices.slice(0, 6).map((p) => (
              <li key={p.slug}>
                <Link to={`/practice-areas/${p.slug}`} className="link-underline text-white/70 hover:text-white">{p.short}</Link>
              </li>
            ))}
            <li>
              <Link to="/practice-areas" className="link-underline text-sand">View all</Link>
            </li>
          </ul>
        </Col>

        <Col title="Offices" delay={0.24}>
          <ul className="space-y-5 text-sm text-white/70">
            {firm.offices.map((o) => (
              <li key={o.name} className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-sand" aria-hidden="true" />
                <span>
                  <span className="block font-semibold text-white">{o.name}</span>
                  {o.lines.join(', ')}
                </span>
              </li>
            ))}
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-sand" aria-hidden="true" />
              <a href={firm.phoneHref} className="link-underline text-white">{firm.phone}</a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-sand" aria-hidden="true" />
              {firm.hoursShort}
            </li>
          </ul>
        </Col>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-4 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {YEAR} {firm.shortName}. All Rights Reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="link-underline hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="shell pb-8 text-[0.7rem] leading-relaxed text-white/35">
          The information on this website is not, nor is it intended to be, legal advice. Contacting us does not create an attorney-client relationship.
        </p>
      </div>
    </footer>
  )
}
