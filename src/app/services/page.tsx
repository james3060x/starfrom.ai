import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { BaseModuleSection, PluginModulesSection, SubscriptionSection } from '@/components/services/ModuleSections'
import { TechStackSection } from '@/components/services/TechStackSection'
import { ComplianceSection } from '@/components/services/ComplianceSection'
import { servicesContent, siteContent } from '@/lib/content'

export const metadata: Metadata = {
  title: servicesContent.hero.title + ' - ' + siteContent.name,
  description: '了解 StarFrom AI 的模块化服务，包括基础模块、9大可插拔模块和3档持续服务，快速部署企业级 AI 解决方案。',
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] py-20">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {servicesContent.hero.title}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {servicesContent.hero.subtitle}
          </p>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <BaseModuleSection />

        <div className="my-12 text-center">
          <Link href="/pricing">
            <Button size="lg" className="bg-[#06b6d4] hover:bg-[#0891b2]">
              {servicesContent.ctaButton}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        <PluginModulesSection />
        
        <div className="my-12 text-center">
          <Link href="/pricing">
            <Button size="lg" className="bg-[#06b6d4] hover:bg-[#0891b2]">
              前往定价器配置方案
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        <SubscriptionSection />
        
        <TechStackSection />
        
        <ComplianceSection />
        
        <div className="py-16 text-center bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {servicesContent.bottomCta.title}
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            {servicesContent.bottomCta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/diagnosis">
              <Button size="lg" className="bg-[#06b6d4] hover:bg-[#0891b2] text-white">
                {servicesContent.bottomCta.primary}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                {servicesContent.bottomCta.secondary}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
