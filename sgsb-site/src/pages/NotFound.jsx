import PageHero from '../components/PageHero'
import { Button, usePageMeta } from '../components/ui'

export default function NotFound() {
  usePageMeta('Page not found')
  return (
    <PageHero eyebrow="404" title="This page could not" highlight="be found." text="The page you are looking for may have moved. Try the links below or call our office.">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button to="/">Back to Home</Button>
        <Button to="/contact" tone="ghost">Contact Us</Button>
      </div>
    </PageHero>
  )
}
