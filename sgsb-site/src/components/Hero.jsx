import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { MapPin, Phone, ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { firm, serviceModes } from '../data/firm'
import { Button, FacebookIcon } from './ui'

const ease = [0.22, 1, 0.36, 1]

/* Headline line: the highlight block wipes in from the left, then each word rises. */
function HeadlineLine({ words, delay, className, highlight = [] }) {
  return (
    <motion.span
      className="block"
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      <span className={`mark-line ${className}`}>
        {words.map((w, i) => (
          <motion.span
            key={i}
            className={`inline-block ${highlight.includes(i) ? 'text-sand' : ''}`}
            initial={{ opacity: 0, y: '0.45em' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: delay + 0.25 + i * 0.07, ease }}
          >
            {w}
            {i < words.length - 1 && ' '}
          </motion.span>
        ))}
      </span>
    </motion.span>
  )
}

/* Hero slideshow — the firm's own photography */
const slides = [
  { src: '/images/site/team-photo-1.jpg', pos: 'object-[60%_30%] lg:object-[46%_25%]', alt: 'The partners of Stegmeier, Gelbart, Schwartz & Benavente on the Orange County coast', caption: 'The SGSB partners · Orange County coast' },
  { src: '/images/site/AAML.jpg', pos: 'object-[50%_35%]', alt: 'SGSB attorneys at the AAML Southern California Chapter awards', caption: 'AAML Southern California Chapter awards · 2022' },
  { src: '/images/site/Sgsb-About-1-1024x512.jpg', pos: 'object-[30%_40%]', alt: 'SGSB attorneys reviewing a case together', caption: 'A dedicated team on every case' },
]
const SLIDE_MS = 6500

/* Practice areas cycled under the headline */
const rotating = ['Divorce', 'Child Custody', 'Child & Spousal Support', 'Move-Away Requests', 'Premarital Agreements', 'Mediation', 'Domestic Violence']

function RotatingPractice() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % rotating.length), 2400)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="relative inline-flex h-[1.5em] min-w-[14ch] overflow-hidden align-bottom" aria-live="off">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={rotating[i]}
          className="absolute left-0 font-semibold whitespace-nowrap text-sand"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          {rotating[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease },
})

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])

  // Slideshow
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setSlide((n) => (n + 1) % slides.length), SLIDE_MS)
    return () => clearTimeout(t)
  }, [slide])

  // Mouse-follow parallax (mouse pointers only)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })
  const photoX = useTransform(sx, (v) => v * -18)
  const photoY = useTransform(sy, (v) => v * -12)
  const cardX = useTransform(sx, (v) => v * 22)
  const cardY = useTransform(sy, (v) => v * 16)
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <section ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="relative isolate flex min-h-[640px] flex-col overflow-hidden bg-ink text-white lg:min-h-[min(100svh,960px)]">
      {/* Photography: SGSB partners on the Laguna coast. Full-bleed on mobile;
          anchored to the right on desktop so the partners stay clearly visible. */}
      <motion.div
        className="absolute inset-0 -z-20 lg:left-auto lg:w-[70%] lg:[mask-image:linear-gradient(90deg,transparent_0%,#000_28%)]"
        style={{ y: imgY }}
        initial={{ clipPath: 'inset(0 0 0 100%)', opacity: 0.4 }}
        animate={{ clipPath: 'inset(0 0 0 0%)', opacity: 1 }}
        transition={{ duration: 1.6, ease }}
      >
        <motion.div className="absolute -inset-6" style={{ x: photoX, y: photoY }}>
          <AnimatePresence initial={false}>
            <motion.img
              key={slides[slide].src}
              src={slides[slide].src}
              alt={slides[slide].alt}
              className={`absolute inset-0 size-full object-cover ${slides[slide].pos}`}
              initial={{ opacity: 0, scale: 1.14 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.4, ease: 'easeInOut' }, scale: { duration: SLIDE_MS / 1000 + 1.5, ease: 'linear' } }}
            />
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Overlays: dark only behind the text; the photo on the right stays bright. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/20 lg:hidden" />
      <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,var(--color-ink)_0%,var(--color-ink)_30%,rgba(19,24,38,0.55)_46%,rgba(19,24,38,0)_62%)] lg:block" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink/85 to-transparent" />

      {/* Social / contact rail */}
      <motion.ul
        className="absolute top-1/2 right-[max(20px,calc((100%-1280px)/2-56px))] hidden -translate-y-1/2 flex-col gap-2 xl:flex"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.7, ease }}
      >
        <li>
          <a href={firm.facebook} target="_blank" rel="noreferrer" aria-label="SGSB on Facebook" className="grid size-10 place-items-center bg-ink/50 backdrop-blur transition-colors duration-300 hover:bg-crimson">
            <FacebookIcon className="size-4" />
          </a>
        </li>
        <li>
          <a href={firm.phoneHref} aria-label={`Call ${firm.phone}`} className="grid size-10 place-items-center bg-ink/50 backdrop-blur transition-colors duration-300 hover:bg-crimson">
            <Phone className="size-4" />
          </a>
        </li>
      </motion.ul>

      {/* Floating credential card over the photo */}
      <motion.div
        className="absolute right-[max(40px,calc((100%-1280px)/2))] bottom-[230px] hidden xl:block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.9, ease }}
      >
        <motion.div style={{ x: cardX, y: cardY }}>
        <motion.div
          className="border border-white/15 bg-ink/60 px-6 py-4 backdrop-blur-md"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-5">
          <span>
            <span className="block font-serif text-3xl font-bold text-sand">1995</span>
            <span className="eyebrow text-[0.62rem] text-white/70">Established</span>
          </span>
          <span className="h-10 w-px bg-white/20" aria-hidden="true" />
          <span>
            <span className="block font-serif text-3xl font-bold text-white">14</span>
            <span className="eyebrow text-[0.62rem] text-white/70">Attorneys</span>
          </span>
          </div>
          {/* Slide caption + progress */}
          <div className="mt-4 border-t border-white/15 pt-3">
            <AnimatePresence mode="wait">
              <motion.p
                key={slide}
                className="max-w-[230px] truncate text-[0.7rem] text-white/70"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
              >
                {slides[slide].caption}
              </motion.p>
            </AnimatePresence>
            <div className="mt-2 flex gap-1.5">
              {slides.map((sl, i) => (
                <button key={sl.src} onClick={() => setSlide(i)} aria-label={`Show photo ${i + 1}`} className="relative h-1.5 flex-1 overflow-hidden bg-white/20">
                  {i === slide && (
                    <motion.span
                      key={slide}
                      className="absolute inset-0 origin-left bg-sand"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                    />
                  )}
                  {i < slide && <span className="absolute inset-0 bg-sand/60" />}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="shell flex flex-1 flex-col justify-end pt-[170px] pb-10 lg:justify-center lg:pt-[190px] lg:pb-14" style={{ y: textY }}>
        <motion.p className="eyebrow mb-6 flex items-center gap-3 text-sand" {...fadeUp(0.2)}>
          <motion.span
            aria-hidden="true"
            className="h-px w-10 origin-left bg-sand"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          />
          {firm.tagline}
        </motion.p>

        <h1 className="max-w-[17ch] text-[2.2rem] leading-[1.34] font-bold tracking-tight sm:text-5xl sm:leading-[1.3] lg:max-w-[24ch] lg:text-[3.1rem] lg:leading-[1.26] xl:text-[3.4rem]">
          <HeadlineLine words={['Experienced', 'Family', 'Law', 'Representation.']} highlight={[1, 2]} delay={0.35} className="bg-ink/85" />
          <span className="mt-2 block">
            <HeadlineLine words={['Focused', 'on', 'What', 'Matters.']} delay={0.75} className="bg-cream text-ink" />
          </span>
        </h1>

        <motion.p className="mt-7 max-w-xl text-base leading-relaxed text-white/80 md:text-lg" {...fadeUp(1.15)}>
          {firm.intro}
        </motion.p>

        <motion.p className="mt-5 flex items-center gap-3 text-base text-white/80 md:text-lg" {...fadeUp(1.22)}>
          <span className="h-px w-6 bg-sand/70" aria-hidden="true" />
          <span>Counsel for</span>
          <RotatingPractice />
        </motion.p>

        <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" {...fadeUp(1.3)}>
          <Button to="/practice-areas" className="shine">Explore Our Practice Areas</Button>
          <Button to="/contact" tone="light">Contact Our Team</Button>
        </motion.div>

        <motion.p className="mt-8 flex items-center gap-2 text-sm text-white/70" {...fadeUp(1.45)}>
          <MapPin className="size-4 text-sand" aria-hidden="true" /> Offices in Orange County &amp; San Diego County
        </motion.p>
      </motion.div>

      {/* Three ways we work — cards rise in one after another */}
      <div className="shell relative">
        <ul className="grid bg-white text-ink md:grid-cols-3">
          {serviceModes.map((m, i) => (
            <motion.li
              key={m.title}
              className={`${i > 0 ? 'border-t border-line md:border-t-0 md:border-l' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + i * 0.12, duration: 0.8, ease }}
            >
              <Link to={m.to} className="group relative flex h-full items-start gap-5 overflow-hidden p-6 transition-colors duration-500 hover:bg-cream lg:p-8">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-crimson transition-transform duration-500 group-hover:scale-x-100" />
                <span className="font-serif text-sm font-bold text-crimson">0{i + 1}</span>
                <span className="flex-1">
                  <span className="flex items-center justify-between font-serif text-xl font-bold">
                    {m.title}
                    <ArrowUpRight className="size-5 text-stone transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-crimson" aria-hidden="true" />
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted">{m.text}</span>
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
