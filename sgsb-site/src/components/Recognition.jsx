import { badges } from '../data/firm'

/** Professional affiliations strip (badges shown on every page of the original site). */
export default function Recognition({ tone = 'light' }) {
  const loop = [...badges, ...badges]
  return (
    <section aria-label="Professional affiliations and recognition" className={`${tone === 'light' ? 'bg-white' : 'bg-cream'} border-y border-line py-10`}>
      <div className="shell flex flex-col items-center gap-8 md:flex-row md:gap-12">
        <p className="eyebrow shrink-0 text-center text-stone md:w-44 md:text-left">Affiliations &amp; recognition</p>
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <ul className="animate-marquee flex w-max items-center gap-14 hover:[animation-play-state:paused]">
            {loop.map((b, i) => (
              <li key={i} aria-hidden={i >= badges.length} className="shrink-0">
                <img
                  src={b.src}
                  alt={i >= badges.length ? '' : b.alt}
                  loading="lazy"
                  className="h-14 w-auto object-contain opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
