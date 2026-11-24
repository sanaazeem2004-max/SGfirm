import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Award } from 'lucide-react'
import { articles, articleImages, articleExcerpt, formatDate, news } from '../data'
import { Reveal, SectionHeading, TextLink } from './ui'

const latest = news.years
  .flatMap((y) => y.entries.flatMap((e) => e.items.map((text) => ({ label: e.label, text }))))
  .filter((n) => n.text.length < 120)
  .slice(0, 3)

export function ArticleCard({ a, index = 0 }) {
  return (
    <motion.li
      className="h-full"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/news/${a.slug}`} className="group flex h-full flex-col bg-white ring-1 ring-line transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-20px_rgba(19,24,38,0.5)]">
        <span className="block aspect-[16/10] overflow-hidden">
          <img src={articleImages[a.slug]} alt="" loading="lazy" className="size-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
        </span>
        <span className="flex flex-1 flex-col p-7">
          <span className="flex items-center gap-3 text-xs">
            <span className="eyebrow text-crimson">{a.category}</span>
            <span className="h-3 w-px bg-line" aria-hidden="true" />
            <time dateTime={a.date} className="text-stone">{formatDate(a.date)}</time>
          </span>
          <h3 className="mt-4 text-xl leading-snug font-bold text-ink transition-colors group-hover:text-crimson">{a.title}</h3>
          <p className="mt-3 line-clamp-3 flex-1 text-[0.92rem] leading-relaxed text-muted">{articleExcerpt(a)}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-crimson">
            Read more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </span>
      </Link>
    </motion.li>
  )
}

export default function Insights() {
  return (
    <section className="section bg-paper">
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Insights & news" title="Guidance from" accent="our attorneys." />
          <Reveal><TextLink to="/news">All news &amp; recognition</TextLink></Reveal>
        </div>
        <ul className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:mt-12 md:grid md:snap-none md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:mt-14 lg:grid-cols-3 [&>li]:w-[85%] [&>li]:shrink-0 [&>li]:snap-start md:[&>li]:w-auto">
          {articles.map((a, i) => <ArticleCard key={a.slug} a={a} index={i} />)}
          <motion.li
            className="h-full md:col-span-2 lg:col-span-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.16 }}
          >
            <Link to="/news" className="group flex h-full min-h-[320px] flex-col justify-between bg-ink p-8 text-white">
              <span>
                <span className="flex items-center gap-3">
                  <Award className="size-6 text-sand" aria-hidden="true" />
                  <span className="eyebrow text-sand">Latest firm news</span>
                </span>
                <span className="mt-6 block divide-y divide-white/10">
                  {latest.map((n) => (
                    <span key={n.text} className="block py-4 first:pt-0">
                      <span className="block text-xs font-semibold tracking-wide text-sand/80 uppercase">{n.label}</span>
                      <span className="mt-1.5 block font-serif text-[1.05rem] leading-snug">{n.text}</span>
                    </span>
                  ))}
                </span>
              </span>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sand">
                Recognition &amp; speaking engagements <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </motion.li>
        </ul>
      </div>
    </section>
  )
}
