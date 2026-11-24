import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, Phone, Search, X, Clock, ArrowRight } from 'lucide-react'
import { firm } from '../data/firm'
import { practices } from '../data/practices'
import { attorneys, attorneyGroups, navigation } from '../data'
import { Logo, FacebookIcon } from './ui'
import SearchDialog from './SearchDialog'

const leftNav = navigation.slice(0, 3)
const rightNav = navigation.slice(3)

/* ---------------- Dropdown panels ---------------- */
function PracticeMenu({ onNavigate }) {
  return (
    <div className="grid w-[min(860px,calc(100vw-80px))] grid-cols-[1fr_260px] bg-white shadow-[0_30px_60px_-20px_rgba(19,24,38,0.35)]">
      <ul className="grid grid-cols-2 gap-x-6 p-7">
        {practices.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/practice-areas/${p.slug}`}
              onClick={onNavigate}
              className="group flex items-center gap-3 py-2.5 text-[0.9rem] text-ink/80 transition-colors hover:text-crimson"
            >
              <p.icon className="size-4 shrink-0 text-stone transition-colors group-hover:text-crimson" aria-hidden="true" />
              <span className="link-underline">{p.short}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-col justify-between bg-ink p-7 text-white">
        <div>
          <p className="eyebrow text-sand">Family law, exclusively</p>
          <p className="mt-3 font-serif text-xl leading-snug">Thousands of matters negotiated and litigated since 1995.</p>
        </div>
        <Link to="/practice-areas" onClick={onNavigate} className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sand">
          All practice areas <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

function AttorneyMenu({ onNavigate }) {
  return (
    <div className="grid w-[min(720px,calc(100vw-80px))] grid-cols-3 gap-6 bg-white p-7 shadow-[0_30px_60px_-20px_rgba(19,24,38,0.35)]">
      {attorneyGroups.map((g) => (
        <div key={g}>
          <p className="eyebrow mb-3 border-b border-line pb-2 text-crimson">{g}</p>
          <ul>
            {attorneys.filter((a) => a.group === g).map((a) => (
              <li key={a.slug}>
                <Link to={`/attorneys/${a.slug}`} onClick={onNavigate} className="link-underline inline-block py-1.5 text-[0.9rem] text-ink/80 hover:text-crimson">
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function NavItem({ item, openMenu, setOpenMenu, align }) {
  const hasMenu = Boolean(item.menu)
  const isOpen = openMenu === item.menu
  const timer = useRef()
  const open = () => { clearTimeout(timer.current); setOpenMenu(item.menu) }
  const close = () => { timer.current = setTimeout(() => setOpenMenu(null), 120) }

  return (
    <li
      className="relative"
      onMouseEnter={hasMenu ? open : undefined}
      onMouseLeave={hasMenu ? close : undefined}
      onKeyDown={(e) => e.key === 'Escape' && setOpenMenu(null)}
    >
      <div className="flex items-center">
        <NavLink
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `relative py-2 text-[0.92rem] font-medium transition-colors ${isActive ? 'text-crimson' : 'text-ink hover:text-crimson'}`
          }
        >
          {({ isActive }) => (
            <>
              {item.label}
              {isActive && <motion.span layoutId="nav-underline" className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-crimson" />}
            </>
          )}
        </NavLink>
        {hasMenu && (
          <button
            type="button"
            aria-label={`${item.label} menu`}
            aria-expanded={isOpen}
            onClick={() => setOpenMenu(isOpen ? null : item.menu)}
            onFocus={open}
            className="ml-0.5 grid size-6 place-items-center text-ink/60 hover:text-crimson"
          >
            <ChevronDown className={`size-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {hasMenu && isOpen && (
          <motion.div
            className={`absolute top-full z-50 pt-5 ${align === 'right' ? 'right-0' : 'left-0'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={open}
            onMouseLeave={close}
          >
            {item.menu === 'practice' ? (
              <PracticeMenu onNavigate={() => setOpenMenu(null)} />
            ) : (
              <AttorneyMenu onNavigate={() => setOpenMenu(null)} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

/* ---------------- Mobile menu ---------------- */
function MobileMenu({ open, onClose, onSearch }) {
  const [section, setSection] = useState(null)
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/60" onClick={onClose} />
          <motion.nav
            aria-label="Mobile"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-ink text-white"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <Logo light className="w-32" />
              <button onClick={onClose} className="grid size-11 place-items-center" aria-label="Close menu">
                <X className="size-6" />
              </button>
            </div>
            <ul className="flex-1 px-5 py-4">
              {navigation.map((item, i) => (
                <motion.li
                  key={item.to}
                  className="border-b border-white/10"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={onClose}
                      className={({ isActive }) => `block flex-1 py-4 font-serif text-xl ${isActive ? 'text-sand' : 'text-white'}`}
                    >
                      {item.label}
                    </NavLink>
                    {item.menu && (
                      <button
                        className="grid size-11 place-items-center text-white/70"
                        aria-label={`Show ${item.label}`}
                        aria-expanded={section === item.menu}
                        onClick={() => setSection(section === item.menu ? null : item.menu)}
                      >
                        <ChevronDown className={`size-5 transition-transform ${section === item.menu ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  <AnimatePresence initial={false}>
                    {section === item.menu && item.menu && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {(item.menu === 'practice'
                          ? practices.map((p) => ({ to: `/practice-areas/${p.slug}`, label: p.short }))
                          : attorneys.map((a) => ({ to: `/attorneys/${a.slug}`, label: a.name }))
                        ).map((l) => (
                          <li key={l.to}>
                            <Link to={l.to} onClick={onClose} className="block py-2 pl-3 text-[0.95rem] text-white/70 hover:text-white">
                              {l.label}
                            </Link>
                          </li>
                        ))}
                        <li className="h-3" />
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-white/10 p-5">
              <button onClick={() => { onClose(); onSearch() }} className="flex w-full items-center gap-3 bg-white/5 px-4 py-3 text-left text-white/80">
                <Search className="size-4" aria-hidden="true" /> Search the site
              </button>
              <a href={firm.phoneHref} className="flex items-center justify-center gap-2 bg-crimson px-4 py-3.5 font-medium">
                <Phone className="size-4" aria-hidden="true" /> {firm.phone}
              </a>
              <p className="text-center text-xs text-white/50">{firm.hoursShort}</p>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------------- Header ---------------- */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [mobile, setMobile] = useState(false)
  const [search, setSearch] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpenMenu(null)
    setMobile(false)
  }, [pathname])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearch(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobile || search ? 'hidden' : ''
  }, [mobile, search])

  return (
    <>
      <a href="#main" className="sr-only z-[90] bg-crimson px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Utility bar */}
        <motion.div
          className="overflow-hidden bg-ink text-white"
          animate={{ height: scrolled ? 0 : 'auto' }}
          initial={false}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="shell flex h-11 items-center justify-between gap-4 text-[0.8rem] whitespace-nowrap">
            <div className="flex min-w-0 items-center gap-6">
              <a href={firm.phoneHref} className="flex items-center gap-2 text-white/85 hover:text-white">
                <Phone className="size-3.5 text-sand" aria-hidden="true" />
                <span className="hidden lg:inline">{firm.remote}:</span>
                <span className="font-semibold">{firm.phone}</span>
              </a>
              <span className="hidden items-center gap-2 whitespace-nowrap text-white/60 lg:flex">
                <Clock className="size-3.5 text-sand" aria-hidden="true" /> {firm.hoursShort}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearch(true)}
                className="hidden items-center gap-2 px-3 py-1.5 text-white/70 hover:text-white lg:flex"
                aria-label="Search the site"
              >
                <Search className="size-3.5" aria-hidden="true" /> Search
                <kbd className="ml-1 rounded border border-white/20 px-1.5 text-[0.65rem] text-white/50">Ctrl K</kbd>
              </button>
              <a href={firm.facebook} target="_blank" rel="noreferrer" className="hidden size-8 place-items-center text-white/70 hover:text-white sm:grid" aria-label="SGSB on Facebook">
                <FacebookIcon className="size-4" />
              </a>
              <Link to="/contact" className="ml-2 hidden bg-crimson px-4 py-2 font-medium transition-colors hover:bg-crimson-dark sm:block">
                Book a Consultation
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Main bar — split tabs with centred logo (desktop) */}
        <div
          className={`relative transition-[background-color,box-shadow] duration-500 ${
            scrolled ? 'bg-white shadow-[0_10px_30px_-15px_rgba(19,24,38,0.3)]' : 'bg-transparent'
          }`}
        >
          <div className="hidden h-[76px] grid-cols-[1fr_auto_1fr] items-stretch lg:grid">
            <nav aria-label="Primary left" className={`flex items-center bg-white pl-[max(40px,calc((100%-1280px)/2))] transition-[border-radius] duration-500 ${scrolled ? '' : 'rounded-br-[2.25rem]'}`}>
              <ul className="flex items-center gap-8">
                {leftNav.map((item) => (
                  <NavItem key={item.to} item={item} openMenu={openMenu} setOpenMenu={setOpenMenu} align="left" />
                ))}
              </ul>
            </nav>
            <Link to="/" className="flex items-center px-10" aria-label="SGSB home">
              <Logo light={!scrolled} className="w-[150px] transition-[filter] duration-500" />
            </Link>
            <nav aria-label="Primary right" className={`flex items-center justify-end bg-white pr-[max(40px,calc((100%-1280px)/2))] transition-[border-radius] duration-500 ${scrolled ? '' : 'rounded-bl-[2.25rem]'}`}>
              <ul className="flex items-center gap-8">
                {rightNav.map((item) => (
                  <NavItem key={item.to} item={item} openMenu={openMenu} setOpenMenu={setOpenMenu} align="right" />
                ))}
                <li className="hidden xl:block">
                  <a href={firm.phoneHref} className="flex items-center gap-2 border-l border-line pl-6 text-[0.92rem] font-semibold text-navy hover:text-crimson">
                    <Phone className="size-4" aria-hidden="true" /> {firm.phone}
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Compact bar (tablet / mobile) */}
          <div className="shell flex h-[68px] items-center justify-between lg:hidden">
            <Link to="/" aria-label="SGSB home">
              <Logo light={!scrolled} className="w-[124px]" />
            </Link>
            <div className={`flex items-center gap-1 ${scrolled ? 'text-ink' : 'text-white'}`}>
              <button onClick={() => setSearch(true)} className="grid size-11 place-items-center" aria-label="Search the site">
                <Search className="size-5" />
              </button>
              <a href={firm.phoneHref} className="grid size-11 place-items-center" aria-label={`Call ${firm.phone}`}>
                <Phone className="size-5" />
              </a>
              <button onClick={() => setMobile(true)} className="grid size-11 place-items-center" aria-label="Open menu" aria-expanded={mobile}>
                <Menu className="size-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu open={mobile} onClose={() => setMobile(false)} onSearch={() => setSearch(true)} />
      <SearchDialog open={search} onClose={() => setSearch(false)} />
    </>
  )
}
