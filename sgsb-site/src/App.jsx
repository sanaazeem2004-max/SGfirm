import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ScrollProgress, BackToTop } from './components/ScrollUI'
import Home from './pages/Home'
const About = lazy(() => import('./pages/About'))
const PracticeAreas = lazy(() => import('./pages/PracticeAreas'))
const PracticeDetail = lazy(() => import('./pages/PracticeDetail'))
const Attorneys = lazy(() => import('./pages/Attorneys'))
const AttorneyDetail = lazy(() => import('./pages/AttorneyDetail'))
const News = lazy(() => import('./pages/News'))
const Article = lazy(() => import('./pages/Article'))
const Contact = lazy(() => import('./pages/Contact'))
const Legal = lazy(() => import('./pages/Legal'))
const NotFound = lazy(() => import('./pages/NotFound'))

const legal = ['privacy-policy', 'terms-conditions', 'disclaimer', 'accessibility-statement']

function AnimatedRoutes() {
  const location = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
      <motion.main
        id="main"
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Suspense fallback={<div className="min-h-screen bg-ink" />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/practice-areas" element={<PracticeAreas />} />
          <Route path="/practice-areas/:slug" element={<PracticeDetail />} />
          <Route path="/attorneys" element={<Attorneys />} />
          <Route path="/attorneys/:slug" element={<AttorneyDetail />} />
          {/* original site used /team/:slug for bios */}
          <Route path="/team/:slug" element={<AttorneyDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<Article />} />
          <Route path="/contact" element={<Contact />} />
          {legal.map((s) => <Route key={s} path={`/${s}`} element={<Legal slug={s} />} />)}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </motion.main>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollProgress />
        <Navbar />
        <AnimatedRoutes />
        <Footer />
        <BackToTop />
      </BrowserRouter>
    </MotionConfig>
  )
}
