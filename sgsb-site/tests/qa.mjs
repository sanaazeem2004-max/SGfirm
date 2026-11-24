// Playwright QA pass: screenshots + layout/health checks for every route.
// Usage: node tests/qa.mjs [baseUrl] [outDir] [--routes=/,/about] [--widths=1440,390] [--noshots]
import { chromium } from 'playwright'
import fs from 'fs'

const args = process.argv.slice(2)
const opt = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split('=')[1]
const base = args.find((a) => a.startsWith('http')) ?? 'http://localhost:5173'
const out = args.find((a) => !a.startsWith('http') && !a.startsWith('--')) ?? 'qa-shots'
const shots = !args.includes('--noshots')
fs.mkdirSync(out, { recursive: true })

const ROUTES = opt('routes')?.split(',') ?? [
  '/', '/about', '/practice-areas', '/practice-areas/dissolution', '/practice-areas/mediation',
  '/attorneys', '/attorneys/saul-m-gelbart', '/attorneys/natali-beltran', '/news',
  '/news/obtaining-domestic-violence-restraining-orders', '/contact', '/privacy-policy', '/disclaimer', '/does-not-exist',
]
const WIDTHS = (opt('widths') ?? '1440,1280,768,390').split(',').map(Number)

const browser = await chromium.launch()
const report = []
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)))
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message.slice(0, 200)))
  page.on('requestfailed', (r) => { if (!r.url().includes('google')) errors.push('requestfailed: ' + r.url()) })
  for (const route of ROUTES) {
    errors.length = 0
    await page.goto(base + route, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    // Scroll through to trigger in-view reveals and lazy images
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.6
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 120))
      }
      window.scrollTo(0, document.documentElement.scrollHeight)
      await new Promise((r) => setTimeout(r, 400))
    })
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(1300)
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth
      const overflowX = document.documentElement.scrollWidth - vw
      const brokenImgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src)
      const shells = [...document.querySelectorAll('.shell')].filter((s) => s.offsetParent && s.getBoundingClientRect().width > 0)
      const lefts = [...new Set(shells.map((s) => Math.round(s.getBoundingClientRect().left)))]
      const rights = [...new Set(shells.map((s) => Math.round(s.getBoundingClientRect().right)))]
      const widths = [...new Set(shells.map((s) => Math.round(s.getBoundingClientRect().width)))]
      // elements poking past the viewport that are not clipped by an overflow-hidden ancestor
      const offenders = []
      for (const el of document.querySelectorAll('main *')) {
        const b = el.getBoundingClientRect()
        if (b.width === 0 || (b.right <= vw + 1 && b.left >= -1)) continue
        let clipped = false
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const o = getComputedStyle(p).overflowX
          if (o === 'hidden' || o === 'clip' || o === 'auto') { clipped = true; break }
        }
        if (!clipped) offenders.push(`${el.tagName}.${String(el.className).slice(0, 60)} [${Math.round(b.left)},${Math.round(b.right)}]`)
      }
      const h1 = document.querySelectorAll('h1').length
      const noAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).length
      const smallTargets = [...document.querySelectorAll('a, button')].filter((e) => {
        const b = e.getBoundingClientRect()
        return e.offsetParent && b.width > 0 && b.height > 0 && b.height < 24 && b.width < 24
      }).length
      return { overflowX, brokenImgs, lefts, rights, widths, offenders: offenders.slice(0, 5), h1, noAlt, smallTargets, height: document.documentElement.scrollHeight, title: document.title }
    })
    r.route = route; r.width = w; r.errors = [...errors]
    report.push(r)
    if (shots) {
      const name = (route === '/' ? 'home' : route.slice(1).replace(/\//g, '_')) + `-${w}.png`
      await page.screenshot({ path: `${out}/${name}`, fullPage: true })
    }
    const flag = r.overflowX > 0 || r.brokenImgs.length || r.errors.length || r.lefts.length > 1 || r.offenders.length || r.h1 !== 1 || r.noAlt
    console.log(`${flag ? 'WARN' : 'ok  '} ${w} ${route} h=${r.height} shellL=${r.lefts} shellW=${r.widths}` +
      (r.overflowX > 0 ? ` overflowX=${r.overflowX}` : '') +
      (r.brokenImgs.length ? ` broken=${r.brokenImgs.join(',')}` : '') +
      (r.errors.length ? ` errors=${JSON.stringify(r.errors)}` : '') +
      (r.offenders.length ? ` offenders=${JSON.stringify(r.offenders)}` : '') +
      (r.h1 !== 1 ? ` h1=${r.h1}` : '') + (r.noAlt ? ` noAlt=${r.noAlt}` : ''))
  }
  await ctx.close()
}
fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 1))
await browser.close()
