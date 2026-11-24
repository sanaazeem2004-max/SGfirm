import { Link } from 'react-router-dom'
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const EASE = [0.22, 1, 0.36, 1]

/* ------------------------------------------------------------------ */
/* Button — Veritas-style label + attached arrow box                   */
/* ------------------------------------------------------------------ */
const tones = {
  crimson: 'bg-crimson text-white hover:bg-crimson-dark',
  navy: 'bg-navy text-white hover:bg-ink',
  light: 'bg-white text-ink hover:bg-cream',
  ghost: 'bg-transparent text-white ring-1 ring-inset ring-white/40 hover:bg-white/10',
  outline: 'bg-transparent text-ink ring-1 ring-inset ring-ink/25 hover:bg-ink hover:text-white',
}
const arrowTones = {
  crimson: 'bg-white text-crimson ring-1 ring-inset ring-crimson',
  navy: 'bg-white text-navy ring-1 ring-inset ring-navy',
  light: 'bg-ink text-white ring-1 ring-inset ring-white',
  ghost: 'bg-white text-ink',
  outline: 'bg-ink text-white',
}

export function Button({ to, href, tone = 'crimson', children, className = '', type, onClick, disabled, ...rest }) {
  const inner = (
    <>
      <span className="flex-1 px-5 py-3.5 text-left text-[0.9rem] font-medium tracking-wide">{children}</span>
      <span
        aria-hidden="true"
        className={`grid w-12 shrink-0 place-items-center self-stretch transition-transform duration-300 ${arrowTones[tone]}`}
      >
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </>
  )
  const cls = `group inline-flex items-stretch overflow-hidden transition-[color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(19,24,38,0.5)] active:translate-y-0 disabled:opacity-60 ${tones[tone]} ${className}`
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{inner}</a>
  return <button type={type ?? 'button'} onClick={onClick} disabled={disabled} className={cls} {...rest}>{inner}</button>
}

/* Text link with animated underline + arrow */
export function TextLink({ to, children, className = '', light = false }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2 text-sm font-semibold tracking-wide ${light ? 'text-sand' : 'text-crimson'} ${className}`}
    >
      <span className="link-underline pb-0.5">{children}</span>
      <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* Reveal — scroll-triggered fade/rise. Honours reduced motion via     */
/* <MotionConfig reducedMotion="user"> in App.                          */
/* ------------------------------------------------------------------ */
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div', once = true }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

/* Image that reveals with a wipe, then drifts with scroll (parallax) */
export function RevealImage({ src, alt, className = '', imgClassName = '', loading = 'lazy' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])
  return (
    <motion.div
      ref={ref}
      className={`group/img relative overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <motion.div className="absolute inset-[-8%_0]" style={{ y }}>
        <motion.img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          className={`size-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/img:scale-[1.04] ${imgClassName}`}
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE }}
        />
      </motion.div>
    </motion.div>
  )
}

/* Words rise one by one out of a mask */
export function WordReveal({ text, className = '', delay = 0, stagger = 0.045, inView = true }) {
  const words = String(text).split(' ')
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }
    : { initial: 'hidden', animate: 'show' }
  return (
    <motion.span className={className} {...trigger} transition={{ staggerChildren: stagger, delayChildren: delay }}>
      {words.map((w, i) => (
        <span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '105%' }, show: { y: '0%' } }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {w}
            {i < words.length - 1 && ' '}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/* Eyebrow label with a line that draws in */
export function Eyebrow({ children, dark = false, center = false, className = '' }) {
  return (
    <motion.p
      className={`eyebrow mb-4 flex items-center gap-3 ${center ? 'justify-center' : ''} ${dark ? 'text-sand' : 'text-crimson'} ${className}`}
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <motion.span
        aria-hidden="true"
        className={`h-px w-8 origin-left ${dark ? 'bg-sand' : 'bg-crimson'}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
      />
      {children}
    </motion.p>
  )
}

/* Number that counts up when scrolled into view */
export function CountUp({ value, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const target = Number(value)
  const isYear = target > 1000
  const [n, setN] = useState(reduce ? target : isYear ? target - 45 : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(isYear ? target - 45 : 0, target, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, reduce, target, isYear])
  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      {n}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* SectionHeading — two-tone serif heading (ink + stone continuation)  */
/* ------------------------------------------------------------------ */
export function SectionHeading({ eyebrow, title, accent, text, align = 'left', dark = false, as: H = 'h2', className = '' }) {
  const center = align === 'center'
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow dark={dark} center={center}>{eyebrow}</Eyebrow>}
      <H className={`text-[2rem] leading-[1.12] font-bold tracking-tight md:text-[2.6rem] lg:text-[3rem] ${dark ? 'text-white' : 'text-ink'}`}>
        <WordReveal text={title} />
        {accent && (
          <>
            {' '}
            <WordReveal text={accent} delay={0.18} className={dark ? 'text-sand' : 'text-stone'} />
          </>
        )}
      </H>
      {text && (
        <Reveal delay={0.1}>
          <p className={`mt-5 text-[1.0625rem] leading-relaxed ${dark ? 'text-white/70' : 'text-muted'}`}>{text}</p>
        </Reveal>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Logo — the firm's own logo file; inverted to white on dark grounds  */
/* ------------------------------------------------------------------ */
export function Logo({ light = false, className = '' }) {
  return (
    <img
      src="/images/site/logo.png"
      alt="Stegmeier, Gelbart, Schwartz & Benavente Law"
      width="584"
      height="210"
      className={`h-auto ${light ? 'brightness-0 invert' : ''} ${className}`}
    />
  )
}

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9Z" />
    </svg>
  )
}

/* Sets document title + meta description per page */
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | Stegmeier, Gelbart, Schwartz & Benavente` : 'Stegmeier, Gelbart, Schwartz & Benavente | Family Law Attorneys'
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description.slice(0, 160))
  }, [title, description])
}
