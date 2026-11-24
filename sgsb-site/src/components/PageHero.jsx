import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { WordReveal } from './ui'

/**
 * Shared inner-page hero. Dark ink ground so the transparent header reads
 * consistently on every page; optional image sits behind a gradient.
 */
export default function PageHero({ eyebrow, title, highlight, text, image, crumbs = [], children }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink pt-[150px] pb-16 text-white md:pb-20 lg:pt-[190px] lg:pb-24">
      {image && (
        <>
          <motion.img
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 size-full object-cover"
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: [1.15, 1, 1.08], opacity: 1 }}
            transition={{ scale: { duration: 24, times: [0, 0.1, 1], ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }, opacity: { duration: 1.2 } }}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
        </>
      )}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-1/3 bg-[repeating-linear-gradient(90deg,transparent_0_22px,rgba(255,255,255,0.03)_22px_23px)] lg:block" />
      <div className="shell">
        {crumbs.length > 0 && (
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/55">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3" aria-hidden="true" />
                  {c.to ? <Link to={c.to} className="hover:text-white">{c.label}</Link> : <span className="text-white/80">{c.label}</span>}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}
        <div className="max-w-3xl">
          {eyebrow && (
            <motion.p
              className="eyebrow mb-5 flex items-center gap-3 text-sand"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              <motion.span
                aria-hidden="true"
                className="h-px w-8 origin-left bg-sand"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />{' '}
              {eyebrow}
            </motion.p>
          )}
          <h1 className="text-[2.4rem] leading-[1.1] font-bold tracking-tight md:text-[3.25rem] lg:text-[3.75rem]">
            <WordReveal text={title} inView={false} delay={0.2} stagger={0.06} />
            {highlight && (
              <>
                {' '}
                <WordReveal text={highlight} inView={false} delay={0.2 + title.split(' ').length * 0.06} stagger={0.06} className="text-sand" />
              </>
            )}
          </h1>
          {text && (
            <motion.p
              className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-white/70 md:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              {text}
            </motion.p>
          )}
          {children && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }} className="mt-9">
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
