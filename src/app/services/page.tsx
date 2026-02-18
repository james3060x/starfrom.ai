import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { BaseModuleSection, PluginModulesSection, SubscriptionSection } from '@/components/services/ModuleSections'
import { TechStackSection } from '@/components/services/TechStackSection'
import { ComplianceSection } from '@/components/services/ComplianceSection'
import { servicesContent, siteContent } from '@/lib/content'

export const metadata: Metadata = {
  title: servicesContent['页面头部']['标题'] + ' - ' + siteContent['网站基础信息']['网站名称'],
  description: '了解 StarFrom AI 的模块化服务，包括基础模块、9大可插拔模块和3档持续服务，快速部署企业级 AI 解决方案。',
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen relative">
      <div className="relative pt-32 pb-20">
        <div className="container max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="badge-neon mb-6 inline-block">
            服务详情
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
            {servicesContent['页面头部']['标题']}
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            {servicesContent['页面头部']['描述']}
          </p>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <BaseModuleSection />

        <div className="my-12 text-center">
          <Link href="/pricing">
            <Button size="lg" className="glow-btn text-white px-8 py-6 text-lg group">
              {servicesContent['CTA 按钮（模块之间）']['按钮文字']}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <PluginModulesSection />
        
        <div className="my-12 text-center">
          <Link href="/pricing">
            <Button size="lg" className="glow-btn text-white px-8 py-6 text-lg group">
              前往定价器配置方案
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <SubscriptionSection />
        
        <TechStackSection />
        
        <ComplianceSection />
        
        <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden my-16">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]" />
          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
              {servicesContent['底部 CTA']['标题']}
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto font-light">
              {servicesContent['底部 CTA']['描述']}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/diagnosis">
                <Button size="lg" className="glow-btn text-white px-10 py-7 text-lg group">
                  {servicesContent['底部 CTA']['主按钮']}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" className="secondary-btn text-white/70 hover:text-white px-10 py-7 text-lg">
                  {servicesContent['底部 CTA']['次按钮']}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
