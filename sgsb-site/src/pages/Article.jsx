import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Phone } from 'lucide-react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import { ArticleCard } from '../components/Insights'
import { Reveal, usePageMeta } from '../components/ui'
import { articles, getArticle, articleImages, articleExcerpt, formatDate } from '../data'
import { firm } from '../data/firm'
import { practices } from '../data/practices'

/** Groups consecutive list items so they render inside one <ul>. */
function renderBlocks(blocks) {
  const out = []
  let list = null
  blocks.forEach((b, i) => {
    if (b.t === 'li') {
      if (!list) { list = []; out.push(<ul key={`ul${i}`}>{list}</ul>) }
      list.push(<li key={i}>{b.v}</li>)
      return
    }
    list = null
    out.push(b.t === 'h' ? <h2 key={i}>{b.v}</h2> : <p key={i}>{b.v}</p>)
  })
  return out
}

export default function Article() {
  const { slug } = useParams()
  const a = getArticle(slug)
  usePageMeta(a?.title, a ? articleExcerpt(a) : null)
  if (!a) return <Navigate to="/news" replace />
  const others = articles.filter((x) => x.slug !== a.slug)
  const relatedPractice = practices.find((p) => p.article === a.slug)

  return (
    <>
      <PageHero
        eyebrow={`${a.category} · ${formatDate(a.date)}`}
        title={a.title}
        image={articleImages[a.slug]}
        crumbs={[{ label: 'News', to: '/news' }, { label: 'Article' }]}
      />
      <section className="section bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal as="article" className="prose-sgsb lg:col-span-8">{renderBlocks(a.blocks)}</Reveal>
          <aside className="lg:col-span-4">
            <div className="space-y-5 lg:sticky lg:top-32">
              <div className="bg-ink p-8 text-white">
                <p className="eyebrow text-sand">Need guidance?</p>
                <p className="mt-3 font-serif text-xl leading-snug font-bold">Speak with an experienced family law attorney.</p>
                <a href={firm.phoneHref} className="mt-6 flex items-center gap-2 font-serif text-2xl font-bold text-sand"><Phone className="size-5" aria-hidden="true" /> {firm.phone}</a>
                <Link to="/contact" className="link-underline mt-4 inline-block text-sm text-white/80">Or send us a message</Link>
              </div>
              {relatedPractice && (
                <Link to={`/practice-areas/${relatedPractice.slug}`} className="block bg-cream p-7 ring-1 ring-line transition-colors hover:bg-white">
                  <span className="eyebrow block text-crimson">Related practice area</span>
                  <span className="mt-2 block font-serif text-lg font-bold text-ink">{relatedPractice.title}</span>
                </Link>
              )}
              <Link to="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-crimson"><ArrowLeft className="size-4" aria-hidden="true" /> All news</Link>
            </div>
          </aside>
        </div>
      </section>
      {others.length > 0 && (
        <section className="section bg-cream">
          <div className="shell">
            <h2 className="text-3xl font-bold text-ink">More from SGSB</h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-2">{others.map((o, i) => <ArticleCard key={o.slug} a={o} index={i} />)}</ul>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  )
}
