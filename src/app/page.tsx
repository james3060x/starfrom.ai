import { HeroSection } from '@/components/home/HeroSection'
import { PainPoints } from '@/components/home/PainPoints'
import { ModulePreview } from '@/components/home/ModulePreview'
import { ProcessTimeline } from '@/components/home/ProcessTimeline'
import { CaseHighlight } from '@/components/home/CaseHighlight'
import { CTASection } from '@/components/home/CTASection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <PainPoints />
      <ModulePreview />
      <ProcessTimeline />
      <CaseHighlight />
      <CTASection />
    </>
  )
}
