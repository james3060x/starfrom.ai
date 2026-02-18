'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Layers, Database, Bot, Link2, Globe, Check } from 'lucide-react'
import { homeContent } from '@/lib/content'

const iconMap = [Database, Bot, Link2, Globe]

// Build features from 模块1-4
const baseFeatures = [
  homeContent['产品服务区域']['模块1'],
  homeContent['产品服务区域']['模块2'],
  homeContent['产品服务区域']['模块3'],
  homeContent['产品服务区域']['模块4'],
]

// Build plugins from 模块1-4 with icons
const plugins = [
  { icon: iconMap[0], title: homeContent['产品服务区域']['模块1'].split(' | ')[0], desc: homeContent['产品服务区域']['模块1'].split(' | ')[1] || '' },
  { icon: iconMap[1], title: homeContent['产品服务区域']['模块2'].split(' | ')[0], desc: homeContent['产品服务区域']['模块2'].split(' | ')[1] || '' },
  { icon: iconMap[2], title: homeContent['产品服务区域']['模块3'].split(' | ')[0], desc: homeContent['产品服务区域']['模块3'].split(' | ')[1] || '' },
  { icon: iconMap[3], title: homeContent['产品服务区域']['模块4'].split(' | ')[0], desc: homeContent['产品服务区域']['模块4'].split(' | ')[1] || '' },
]

export function ModulePreview() {
  return (
    <section className="relative py-32">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="badge-pink mb-6">
            {homeContent['产品服务区域']['区域标签']}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-5">
            {homeContent['产品服务区域']['区域标题']}
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto font-light">
            {homeContent['产品服务区域']['区域描述']}
          </p>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
          {/* Base Module - Large Card */}
          <div className="lg:col-span-3">
            <div className="glass-card p-8 card-hover h-full">
              {/* Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-pink-500 to-blue-500" />
              
              {/* Header */}
              <div className="flex items-start gap-5 mb-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Layers className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-1">{homeContent['产品服务区域']['标题']}</h3>
                  <p className="text-white/40 text-sm">{homeContent['产品服务区域']['副标题']}</p>
                </div>
              </div>
              
              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {baseFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-white/70 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* Price & CTA */}
              <div className="flex items-end justify-between pt-6 border-t border-white/[0.06]">
                <div>
                  <span className="text-3xl font-semibold text-white">{homeContent['产品服务区域']['价格']}</span>
                  <span className="text-white/40 ml-1">{homeContent['产品服务区域']['价格说明']}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Plugin Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-4">
            {plugins.map((plugin, index) => (
              <div key={index} className="glass-card p-5 card-hover flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <plugin.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-0.5">{plugin.title}</h4>
                  <p className="text-white/40 text-sm">{plugin.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <Link href="/pricing">
            <Button size="lg" className="glow-btn text-white px-8">
              {homeContent['产品服务区域']['CTA按钮']}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
