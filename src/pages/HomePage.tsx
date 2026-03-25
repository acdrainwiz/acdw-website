import { Hero } from '../components/home/Hero'
import type { PageSearchMeta } from '../config/siteSearchTypes'

export const PAGE_SEARCH_META: PageSearchMeta = {
  id: 'page-home',
  kind: 'site',
  title: 'AC Drain Wiz — Home',
  body:
    'Main AC Drain Wiz homepage. Condensate drain line maintenance access, AC Drain Wiz Mini permanent service port on 3/4 inch PVC, flush compressed air and vacuum without cutting pipe. AC Drain Wiz Sensor overflow protection and WiFi monitoring options. Homeowner and contractor paths, product highlights, testimonials, installation video, DIY and professional solutions. Transparent body, bayonet port, code-compliant maintenance access.',
  tags: ['home', 'mini', 'sensor', 'drain line', 'condensate', 'PVC', 'contractor', 'homeowner'],
  href: '/',
}

export function HomePage() {
  return (
    <>
      <Hero />
    </>
  )
}
