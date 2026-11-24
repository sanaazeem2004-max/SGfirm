import Hero from '../components/Hero'
import AboutFirm from '../components/AboutFirm'
import PracticeAreas from '../components/PracticeAreas'
import WhyChooseUs, { Process } from '../components/WhyChooseUs'
import Attorneys from '../components/Attorneys'
import Recognition from '../components/Recognition'
import Insights from '../components/Insights'
import Contact from '../components/Contact'
import { usePageMeta } from '../components/ui'

export default function Home() {
  usePageMeta(null, 'Stegmeier, Gelbart, Schwartz & Benavente, LLP — family law attorneys in Orange County and San Diego County since 1995.')
  return (
    <>
      <Hero />
      <AboutFirm />
      <PracticeAreas />
      <WhyChooseUs />
      <Process />
      <Attorneys />
      <Recognition />
      <Insights />
      <Contact />
    </>
  )
}
