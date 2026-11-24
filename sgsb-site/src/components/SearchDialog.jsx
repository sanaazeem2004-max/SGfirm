import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, CornerDownLeft } from 'lucide-react'
import { practices } from '../data/practices'
import { attorneys, articles, bioLead } from '../data'

const index = [
  { type: 'Page', title: 'About the Firm', to: '/about', text: 'History, distinctions, team approach, timeline' },
  { type: 'Page', title: 'Practice Areas', to: '/practice-areas', text: 'All family law services' },
  { type: 'Page', title: 'Attorneys', to: '/attorneys', text: 'Partners, associates and of counsel' },
  { type: 'Page', title: 'News & Recognition', to: '/news', text: 'Awards, speaking engagements, firm news' },
  { type: 'Page', title: 'Contact', to: '/contact', text: 'Irvine and San Diego offices, consultation form' },
  ...practices.map((p) => ({ type: 'Practice Area', title: p.title, to: `/practice-areas/${p.slug}`, text: p.summary })),
  ...attorneys.map((a) => ({ type: 'Attorney', title: a.name, to: `/attorneys/${a.slug}`, text: `${a.title} — ${bioLead(a)}` })),
  ...articles.map((a) => ({ type: 'Article', title: a.title, to: `/news/${a.slug}`, text: a.category })),
]

export default function SearchDialog({ open, onClose }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return index.filter((i) => i.type !== 'Attorney').slice(0, 8)
    const words = term.split(/\s+/)
    return index
      .map((i) => {
        const hay = `${i.title} ${i.text} ${i.type}`.toLowerCase()
        if (!words.every((w) => hay.includes(w))) return null
        const score = i.title.toLowerCase().includes(term) ? 2 : 1
        return { ...i, score }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }, [q])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30)
  }, [open])

  const close = () => {
    setQ('')
    setActive(0)
    onClose()
  }

  const go = (item) => {
    close()
    navigate(item.to)
  }

  const onKey = (e) => {
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    if (e.key === 'Enter' && results[active]) go(results[active])
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-ink/70 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            className="w-full max-w-2xl overflow-hidden bg-white shadow-2xl"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={onKey}
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <Search className="size-5 text-stone" aria-hidden="true" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => { setQ(e.target.value); setActive(0) }}
                placeholder="Search practice areas, attorneys, articles…"
                aria-label="Search"
                className="h-16 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-stone/70"
              />
              <button onClick={close} className="grid size-9 place-items-center text-stone hover:text-ink" aria-label="Close search">
                <X className="size-5" />
              </button>
            </div>
            <ul className="max-h-[55vh] overflow-y-auto p-2" role="listbox">
              {results.length === 0 && <li className="px-4 py-10 text-center text-sm text-muted">No results for “{q}”.</li>}
              {results.map((r, i) => (
                <li key={r.to} role="option" aria-selected={i === active}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                    className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors ${i === active ? 'bg-cream' : ''}`}
                  >
                    <span className="w-24 shrink-0 text-[0.68rem] font-semibold tracking-[0.14em] text-crimson uppercase">{r.type}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif font-semibold text-ink">{r.title}</span>
                      <span className="block truncate text-sm text-muted">{r.text}</span>
                    </span>
                    {i === active && <CornerDownLeft className="size-4 shrink-0 text-stone" aria-hidden="true" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
