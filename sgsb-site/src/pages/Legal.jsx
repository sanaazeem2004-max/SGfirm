import { Link, Navigate } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { Reveal, usePageMeta } from '../components/ui'
import { getLegal, legalPages } from '../data'

export default function Legal({ slug }) {
  const page = getLegal(slug)
  usePageMeta(page?.title)
  if (!page) return <Navigate to="/" replace />
  return (
    <>
      <PageHero eyebrow="Legal" title={page.title} crumbs={[{ label: page.title }]} />
      <section className="section bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal as="article" className="prose-sgsb lg:col-span-8">
            {page.blocks.map((b, i) => (b.t === 'h' ? <h2 key={i}>{b.v}</h2> : <p key={i}>{b.v}</p>))}
          </Reveal>
          <aside className="lg:col-span-4">
            <nav aria-label="Legal pages" className="bg-cream p-7 ring-1 ring-line lg:sticky lg:top-32">
              <p className="eyebrow text-crimson">Legal notices</p>
              <ul className="mt-4 space-y-3">
                {legalPages.map((l) => (
                  <li key={l.slug}>
                    <Link to={`/${l.slug}`} aria-current={l.slug === slug ? 'page' : undefined} className={`link-underline text-[0.95rem] ${l.slug === slug ? 'font-semibold text-crimson' : 'text-ink'}`}>
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>
    </>
  )
}
