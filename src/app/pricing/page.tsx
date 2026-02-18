import { Metadata } from 'next'
import { ModuleSelector } from '@/components/pricing/ModuleSelector'
import { PriceSummaryBar } from '@/components/pricing/PriceSummaryBar'
import { pricingContent, siteContent } from '@/lib/content'

export const metadata: Metadata = {
  title: pricingContent['页面头部'].标题 + ' - ' + siteContent['网站基础信息']['网站名称'],
  description: pricingContent['页面头部'].描述,
}

export default function PricingPage() {
  return (
    <div className="min-h-screen relative">
      <div className="relative pt-32 pb-16">
        <div className="container max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="badge-pink mb-6 inline-block">
            模块化定价
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
            {pricingContent['页面头部'].标题}
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            {pricingContent['页面头部'].描述}
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
