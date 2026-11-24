import attorneysData from './attorneys.json'
import articlesData from './articles.json'
import legalData from './legal.json'
import newsData from './news.json'

export const attorneys = attorneysData.attorneys
export const attorneyGroups = ['Partners', 'Associates', 'Of Counsel']
export const getAttorney = (slug) => attorneys.find((a) => a.slug === slug)
export const partners = attorneys.filter((a) => a.group === 'Partners')

/** First biography paragraph, used for cards and meta descriptions. */
export const bioLead = (a) => a.sections.find((s) => s.heading === 'Biography')?.paragraphs[0] ?? ''

export const articles = articlesData
export const getArticle = (slug) => articles.find((a) => a.slug === slug)
export const articleImages = {
  'your-divorce-lawyer-should-be-a-certified-family-law-specialist': '/images/site/About-join.jpg',
  'obtaining-domestic-violence-restraining-orders': '/images/site/police.jpg',
}
export const articleExcerpt = (a) => a.blocks.find((b) => b.t === 'p')?.v ?? ''
export const formatDate = (iso) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export const legalPages = legalData
export const getLegal = (slug) => legalPages.find((l) => l.slug === slug)

export const news = newsData

export const navigation = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Practice Areas', to: '/practice-areas', menu: 'practice' },
  { label: 'Attorneys', to: '/attorneys', menu: 'attorneys' },
  { label: 'News', to: '/news' },
  { label: 'Contact', to: '/contact' },
]
