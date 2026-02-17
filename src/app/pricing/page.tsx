import { Metadata } from 'next'
import { ModuleSelector } from '@/components/pricing/ModuleSelector'
import { PriceSummaryBar } from '@/components/pricing/PriceSummaryBar'
import { pricingContent, siteContent } from '@/lib/content'

export const metadata: Metadata = {
  title: pricingContent.hero.title + ' - ' + siteContent.name,
  description: '根据您的业务需求，灵活选择 AI 服务模块，实时计算价格，获取专属报价方案。',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] py-16">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {pricingContent.hero.title}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {pricingContent.hero.subtitle}
          </p>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ModuleSelector />
          </div>
          
          <div className="lg:col-span-1">
            <PriceSummaryBar />
          </div>
        </div>
      </div>
    </div>
  )
}
