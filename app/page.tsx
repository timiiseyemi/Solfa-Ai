import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { SolfaIntroduction } from '@/components/solfa-introduction'
import { TrustBar } from '@/components/trust-bar'
import { Features } from '@/components/features'
import { ProductPreview } from '@/components/product-preview'
import { Workflow } from '@/components/workflow'
import { Benefits } from '@/components/benefits'
import { Testimonials } from '@/components/testimonials'
import { Pricing } from '@/components/pricing'
import { FAQ } from '@/components/faq'
import { SiteFooter } from '@/components/site-footer'
import { ScrollToTop } from '@/components/scroll-to-top'
import { CursorDotTrail } from '@/components/animations/CursorDotTrail'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <CursorDotTrail />
      <main>
        <Hero />
        <SolfaIntroduction />
        <TrustBar />
        <Features />
        <ProductPreview />
        <Workflow />
        <Benefits />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <SiteFooter />
      <ScrollToTop />
    </>
  )
}
