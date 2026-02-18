'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { homeContent } from '@/lib/content'

const featuredCases = homeContent['成功案例区域']['案例列表'].map((item: { title: string; industry: string; size: string; metrics: { label: string; value: string }[] }) => ({
  id: item.title,
  title: item.title,
  industry: item.industry,
  companySize: item.size,
  metrics: item.metrics,
}))

export function CaseHighlight() {
  return (
    <section className="relative py-32">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="badge-neon mb-6">
            {homeContent['成功案例区域']['区域标签']}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-5">
            {homeContent['成功案例区域']['区域标题']}
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto font-light">
            {homeContent['成功案例区域']['区域描述']}
          </p>
        </div>
        
        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featuredCases.map((item) => (
            <div key={item.id} className="glass-card p-6 card-hover">
              {/* Tags */}
              <div className="flex gap-2 mb-5">
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
                  {item.industry}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs">
                  {item.companySize}
                </span>
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-semibold text-white mb-5">{item.title}</h3>
              
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                {item.metrics.map((metric, idx) => (
                  <div key={idx} className="text-center p-3 rounded-lg bg-white/[0.02]">
                    <div className="text-lg font-semibold gradient-text mb-0.5">{metric.value}</div>
                    <div className="text-white/30 text-xs">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <Link href="/cases">
            <Button size="lg" className="secondary-btn text-white/70 hover:text-white px-8">
              {homeContent['成功案例区域']['CTA按钮']}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
