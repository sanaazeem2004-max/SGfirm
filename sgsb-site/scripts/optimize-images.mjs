// Recompress photography in public/images in place (max 1600px wide for site
// imagery, 800px for portraits). Safe to re-run: skips files already small.
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
sharp.cache(false)

const jobs = [
  { dir: 'public/images/attorneys', max: 800 },
  { dir: 'public/images/site', max: 1600 },
]
for (const { dir, max } of jobs) {
  for (const f of fs.readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f))) {
    const p = path.join(dir, f)
    const before = fs.statSync(p).size
    if (before < 140 * 1024) continue
    const buf = await sharp(fs.readFileSync(p)).rotate().resize({ width: max, withoutEnlargement: true }).jpeg({ quality: 78, progressive: true, mozjpeg: true }).toBuffer()
    if (buf.length < before) {
      fs.writeFileSync(p, buf)
      console.log(`${p}: ${Math.round(before / 1024)}KB -> ${Math.round(buf.length / 1024)}KB`)
    }
  }
}
