// Interaction tests: navigation, dropdowns, mobile menu, search, form, filters, link crawl.
// Usage: node tests/interactions.mjs [baseUrl] [shotDir]
import { chromium } from 'playwright'
import fs from 'fs'

const base = process.argv[2] ?? 'http://localhost:5173'
const shotDir = process.argv[3] ?? 'qa-shots/interactions'
fs.mkdirSync(shotDir, { recursive: true })
const results = []
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`) }

const browser = await chromium.launch()

/* ---------- Desktop ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(base + '/', { waitUntil: 'networkidle' })

  // Practice Areas dropdown on hover
  await page.getByRole('navigation', { name: 'Primary left' }).getByRole('link', { name: 'Practice Areas' }).hover()
  await page.waitForTimeout(400)
  const megaVisible = await page.getByRole('link', { name: 'Move-Away Requests' }).first().isVisible()
  check('Practice Areas dropdown opens on hover', megaVisible)
  await page.screenshot({ path: `${shotDir}/dropdown-practice-1440.png` })
  await page.getByRole('link', { name: 'Move-Away Requests' }).first().click()
  await page.waitForURL('**/practice-areas/child-custody-requests')
  check('Dropdown link navigates', page.url().endsWith('/practice-areas/child-custody-requests'))
  await page.waitForTimeout(500)
  check('Practice detail H1', (await page.locator('h1').innerText()).includes('Move-Away'))

  // Attorneys dropdown via keyboard-accessible button
  await page.getByRole('button', { name: 'Attorneys menu' }).click()
  await page.waitForTimeout(400)
  check('Attorneys dropdown opens on click', await page.getByRole('link', { name: 'Robert A. Benavente' }).first().isVisible())
  await page.screenshot({ path: `${shotDir}/dropdown-attorneys-1440.png` })
  await page.keyboard.press('Escape')

  // Sticky header after scroll
  await page.mouse.wheel(0, 1200)
  await page.waitForTimeout(700)
  const headerTop = await page.locator('header').evaluate((h) => h.getBoundingClientRect().top)
  check('Header stays fixed after scroll', headerTop === 0)

  // Search (Ctrl+K)
  await page.keyboard.press('Control+k')
  await page.waitForTimeout(300)
  await page.getByRole('textbox', { name: 'Search' }).fill('benavente')
  await page.waitForTimeout(200)
  await page.screenshot({ path: `${shotDir}/search-1440.png` })
  await page.keyboard.press('Enter')
  await page.waitForURL('**/attorneys/robert-a-benavente')
  check('Search → Enter navigates to attorney', page.url().endsWith('/attorneys/robert-a-benavente'))

  // Practice areas filter + search
  await page.goto(base + '/practice-areas', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Children & parenting' }).click()
  await page.waitForTimeout(500)
  check('Practice filter: Children & parenting → 4', (await page.getByText('Showing 4 of 12').count()) === 1)
  await page.getByRole('button', { name: 'All areas' }).click()
  await page.getByPlaceholder('Search practice areas').fill('prenuptial')
  await page.waitForTimeout(500)
  check('Practice search "prenuptial" → 1', (await page.getByText('Showing 1 of 12').count()) === 1)

  // Attorney filter
  await page.goto(base + '/attorneys', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Of Counsel', exact: true }).click()
  await page.waitForTimeout(400)
  check('Attorney filter Of Counsel → 4 cards', (await page.locator('main ul li a[href^="/attorneys/"]').count()) === 4)

  // News year tabs
  await page.goto(base + '/news', { waitUntil: 'networkidle' })
  await page.getByRole('tab', { name: '2017' }).click()
  await page.waitForTimeout(500)
  check('News year tab 2017 shows entries', await page.getByText('Family Law Person of the Year', { exact: false }).first().isVisible())

  // Contact form: validation then submit
  await page.goto(base + '/contact', { waitUntil: 'networkidle' })
  const form = page.getByRole('form', { name: 'Consultation request form' })
  await form.getByRole('button', { name: /Submit/ }).click()
  await page.waitForTimeout(300)
  const errCount = await form.locator('[id$="-error"]').count()
  check('Form shows validation errors when empty', errCount >= 6, `${errCount} errors`)
  await page.screenshot({ path: `${shotDir}/form-errors-1440.png`, fullPage: false })
  await form.locator('#first').fill('Test')
  await form.locator('#last').fill('Visitor')
  await form.locator('#email').fill('test@example.com')
  await form.locator('#phone').fill('(949) 555-0100')
  await form.locator('#zip').fill('92612')
  await form.getByRole('checkbox', { name: 'Phone' }).check()
  await form.locator('#message').fill('Testing the consultation form end to end.')
  await form.locator('#agree').check()
  await form.getByRole('button', { name: /Submit/ }).click()
  await page.getByText('Thank you.').waitFor({ timeout: 4000 }).catch(() => {})
  check('Form submits and shows confirmation', await page.getByText('Thank you.').isVisible())

  // Link crawl: every internal href on every reachable page resolves to a non-404 page
  const seen = new Set(['/'])
  const queue = ['/']
  const bad = []
  while (queue.length) {
    const path = queue.shift()
    await page.goto(base + path, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(250)
    const h1 = await page.locator('h1').first().innerText().catch(() => '')
    if (/could not/i.test(h1)) bad.push(path)
    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')))
    for (const h of hrefs) {
      if (!h || !h.startsWith('/') || h.startsWith('//')) continue
      const clean = h.split('#')[0]
      if (!seen.has(clean)) { seen.add(clean); queue.push(clean) }
    }
  }
  check(`Internal link crawl (${seen.size} unique URLs)`, bad.length === 0, bad.join(', '))

  // External links respond
  const ext = ['https://www.facebook.com/SGSBLawFirm/']
  for (const u of ext) {
    const r = await page.request.get(u).catch(() => null)
    check(`External link reachable: ${u}`, !!r && r.status() < 500, r ? String(r.status()) : 'no response')
  }
  check('No runtime errors (desktop run)', errors.length === 0, errors.slice(0, 3).join(' | '))
  await page.close()
}

/* ---------- Mobile ---------- */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.waitForTimeout(600)
  const nav = page.getByRole('navigation', { name: 'Mobile' })
  check('Mobile menu opens', await nav.isVisible())
  await nav.getByRole('button', { name: 'Show Practice Areas' }).click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${shotDir}/mobile-menu-390.png` })
  await nav.getByRole('link', { name: 'Mediation' }).click()
  await page.waitForURL('**/practice-areas/mediation')
  await page.waitForTimeout(500)
  check('Mobile menu link navigates & closes', page.url().endsWith('/mediation') && !(await nav.isVisible()))
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  check('No horizontal overflow on mobile detail page', overflow === 0, `overflow=${overflow}`)
  await page.close()
}

/* ---------- Reduced motion ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const anim = await page.evaluate(() => getComputedStyle(document.querySelector('.animate-marquee')).animationName)
  check('Reduced motion disables marquee', anim === 'none', anim)
  await ctx.close()
}

fs.writeFileSync(`${shotDir}/results.json`, JSON.stringify(results, null, 1))
const failed = results.filter((r) => !r.ok).length
console.log(`\n${results.length - failed}/${results.length} passed`)
await browser.close()
process.exit(failed ? 1 : 0)
