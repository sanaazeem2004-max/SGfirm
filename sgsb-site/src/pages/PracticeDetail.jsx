import { Link, Navigate, useParams } from 'react-router-dom'
import { Check, Phone, ArrowRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import { AttorneyCard } from '../components/Attorneys'
import { PracticeCard } from '../components/PracticeAreas'
import { Button, Reveal, RevealImage, SectionHeading, usePageMeta } from '../components/ui'
import { getPractice, practices } from '../data/practices'
import { approach, firm } from '../data/firm'
import { getAttorney, partners, getArticle } from '../data'

export default function PracticeDetail() {
  const { slug } = useParams()
  const p = getPractice(slug)
  usePageMeta(p?.title, p?.body[0])
  if (!p) return <Navigate to="/practice-areas" replace />

  const Icon = p.icon
  const team = p.attorneys ? p.attorneys.map(getAttorney) : partners
  const idx = practices.indexOf(p)
  const related = [1, 2, 3].map((n) => practices[(idx + n) % practices.length])
  const article = p.article && getArticle(p.article)

  return (
    <>
      <PageHero
        eyebrow="Practice area"
        title={p.title}
        text={p.summary}
        image={p.image}
        crumbs={[{ label: 'Practice Areas', to: '/practice-areas' }, { label: p.short }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to="/contact">Book a Consultation</Button>
          <a href={firm.phoneHref} className="inline-flex items-center justify-center gap-2 px-5 py-3.5 font-medium ring-1 ring-white/30 ring-inset hover:bg-white/10">
            <Phone className="size-4 text-sand" aria-hidden="true" /> {firm.phone}
          </a>
        </div>
      </PageHero>

      {/* Introduction + services */}
      <section className="section bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal className="flex items-center gap-4">
              <span className="grid size-14 place-items-center bg-ink text-sand"><Icon className="size-6" aria-hidden="true" /></span>
              <p className="eyebrow text-crimson">Overview</p>
            </Reveal>
            <Reveal delay={0.05} className="prose-sgsb mt-8">
              {p.body.map((t) => <p key={t.slice(0, 30)}>{t}</p>)}
            </Reveal>
            {article && (
              <Reveal delay={0.1} className="mt-10">
                <Link to={`/news/${article.slug}`} className="group flex items-center justify-between gap-6 bg-cream p-6 ring-1 ring-line transition-colors hover:bg-white">
                  <span>
                    <span className="eyebrow block text-crimson">Related article</span>
                    <span className="mt-2 block font-serif text-lg font-bold text-ink">{article.title}</span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-crimson transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Reveal>
            )}
          </div>
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              {p.items ? (
                <Reveal className="bg-ink p-8 text-white lg:p-10">
                  <h2 className="text-2xl font-bold">Legal services</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{p.itemsTitle}</p>
                  <ul className="mt-6 space-y-3.5">
                    {p.items.map((it) => (
                      <li key={it} className="flex gap-3 text-[0.95rem] text-white/85">
                        <Check className="mt-0.5 size-4 shrink-0 text-sand" aria-hidden="true" /> {it}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : (
                <RevealImage src={p.image} alt="" className="aspect-[4/3] w-full" />
              )}
              <Reveal delay={0.1} className="mt-5 bg-cream p-8 ring-1 ring-line">
                <h2 className="text-xl font-bold text-ink">Speak with an attorney</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">Schedule a consultation with the attorney of your choice. Remote consultations available.</p>
                <a href={firm.phoneHref} className="mt-5 flex items-center gap-3 font-serif text-2xl font-bold text-navy hover:text-crimson">
                  <Phone className="size-5" aria-hidden="true" /> {firm.phone}
                </a>
                <p className="mt-1 text-xs text-stone">{firm.hoursShort}</p>
              </Reveal>
            </div>
          </aside>
        </div>
      </section>

      {/* How we approach it (firm-wide approach, About page) */}
      <section className="section bg-cream">
        <div className="shell">
          <SectionHeading eyebrow="How we work" title="Negotiation first," accent="trial-ready always." />
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((s, i) => (
              <Reveal as="li" key={s.step} delay={i * 0.07} className="flex h-full flex-col bg-white p-7 ring-1 ring-line">
                <span className="eyebrow text-crimson">{s.step}</span>
                <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Relevant attorneys */}
      <section className="section bg-paper">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow={p.attorneysTitle ?? 'Your case team'}
              title={p.attorneys ? 'Experienced mediators,' : 'Every case is led'}
              accent={p.attorneys ? 'both AAML Fellows.' : 'by an SGSB partner.'}
              text={p.attorneys ? undefined : 'Upon retaining SGSB, a dedicated team consisting of a partner, associate attorney, and paralegal is assigned to the case.'}
            />
            <Reveal><Link to="/attorneys" className="link-underline text-sm font-semibold text-crimson">View all attorneys</Link></Reveal>
          </div>
          <ul className={`mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5 ${p.attorneys ? 'lg:grid-cols-4' : 'xl:grid-cols-6'}`}>
            {team.map((a, i) => <AttorneyCard key={a.slug} a={a} index={i} />)}
          </ul>
        </div>
      </section>

      {/* Related */}
      <section className="section bg-cream">
        <div className="shell">
          <SectionHeading eyebrow="Related practice areas" title="Other ways" accent="we can help." />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {related.map((r) => <PracticeCard key={r.slug} p={r} index={practices.indexOf(r)} />)}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
