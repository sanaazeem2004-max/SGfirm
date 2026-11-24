// One-off content pipeline: converts the text captured from
// stegmeierandgelbart.com (via Playwright) into JSON used by the React app.
// Usage: node scripts/build-data.mjs <capture-dir>
import fs from 'fs';
import path from 'path';

const src = process.argv[2];
const out = path.resolve('src/data');
fs.mkdirSync(out, { recursive: true });
const ex = JSON.parse(fs.readFileSync(path.join(src, 'extracted.json'), 'utf8'));
const raw = (slug) => fs.readFileSync(path.join(src, `page-${slug}.txt`), 'utf8').split('=IMGS=')[0];
const clean = (s) => s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

// ---------- Attorneys ----------
const ORDER = ex.team.map((t) => t.slug);
const attorneys = ex.team.map((t) => {
  const blocks = t.blocks.map((b) => ({ ...b, v: clean(b.v) })).filter((b) => b.v);
  const title = blocks[0].v;
  const sections = [];
  let cur = null;
  for (const b of blocks.slice(1)) {
    if (b.t === 'h') { cur = { heading: b.v, paragraphs: [], items: [] }; sections.push(cur); continue; }
    if (!cur) continue;
    const prose = cur.heading === 'Biography' || cur.heading === 'Community Involvement';
    (prose && b.t === 'p' ? cur.paragraphs : cur.items).push(b.v);
  }
  const group = /^(Partner|Managing Partner)/.test(title) ? 'Partners' : /Associate/.test(title) ? 'Associates' : 'Of Counsel';
  return { slug: t.slug, name: t.name, title, group, image: `/images/attorneys/${t.slug}.jpg`, sections };
});
fs.writeFileSync(path.join(out, 'attorneys.json'), JSON.stringify({ order: ORDER, attorneys }, null, 1));

// ---------- Articles ----------
const DATES = {
  'your-divorce-lawyer-should-be-a-certified-family-law-specialist': { date: '2023-02-06', category: 'Choosing Counsel' },
  'obtaining-domestic-violence-restraining-orders': { date: '2023-01-30', category: 'Domestic Violence' },
};
const articles = ex.posts.map((p) => ({
  slug: p.slug,
  title: p.name,
  ...DATES[p.slug],
  blocks: p.blocks.map((b) => {
    const v = clean(b.v);
    if (b.t === 'p' && /^(Step \d+:|\d+\.\s)/.test(v) && v.length < 90) return { t: 'h', v };
    return { t: b.t, v };
  }),
}));
fs.writeFileSync(path.join(out, 'articles.json'), JSON.stringify(articles, null, 1));

// ---------- Legal pages (from raw page text) ----------
const legal = ['privacy-policy', 'terms-conditions', 'disclaimer', 'accessibility-statement'].map((slug) => {
  const lines = raw(slug).split('\n').map(clean).filter(Boolean);
  const title = lines[0];
  const blocks = lines.slice(1).map((v) => {
    const isHeading = /^[A-Z]/.test(v) && !v.endsWith('and/or') && v.length < 70 && !/[.;:,]$/.test(v) && !/^(your|the|certain|a |an )/i.test(v);
    return { t: isHeading ? 'h' : 'p', v };
  }).filter((b) => !/Karlin Law Firm/.test(b.v)); // stray third-party copyright line in source boilerplate
  return { slug, title, blocks };
});
fs.writeFileSync(path.join(out, 'legal.json'), JSON.stringify(legal, null, 1));

// ---------- News timeline ----------
const MONTH = /^(January|February|March|April|May|June|July|August|September|October|November|December|Spring|Summer|Fall|Winter) \d{4}$/;
const nl = raw('news').split('\n').map(clean).filter(Boolean).slice(1);
const intro = [];
const years = [];
let y = null, m = null;
for (const line of nl) {
  if (/^\d{4}$/.test(line)) { y = { year: line, entries: [] }; years.push(y); m = null; continue; }
  if (!y) { if (!line.startsWith('Some of our activities')) intro.push(line); continue; }
  if (MONTH.test(line)) { m = { label: line, items: [] }; y.entries.push(m); continue; }
  if (!m) { m = { label: y.year, items: [] }; y.entries.push(m); }
  m.items.push(line);
}
fs.writeFileSync(path.join(out, 'news.json'), JSON.stringify({ intro, years }, null, 1));

console.log('attorneys', attorneys.length, 'articles', articles.length, 'legal', legal.length, 'news years', years.length);
