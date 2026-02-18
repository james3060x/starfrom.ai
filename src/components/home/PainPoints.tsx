'use client'

import { Workflow } from 'lucide-react'
import { homeContent } from '@/lib/content'

const painPoints = [
  {
    icon: Workflow,
    title: homeContent['痛点区域']['标题'],
    solution: homeContent['痛点区域']['解决方案'],
    description: homeContent['痛点区域']['描述'],
    stat: homeContent['痛点区域']['数据'],
  },
]

export function PainPoints() {
  return (
    <section className="relative py-32">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="badge-neon mb-6">
            {homeContent['痛点区域']['区域标签']}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-5">
            {homeContent['痛点区域']['区域标题']}
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto font-light">
            {homeContent['痛点区域']['区域描述']}
          </p>
        </div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {painPoints.map((item, index) => (
            <div
              key={index}
              className="group"
            >
              <div className="glass-card p-8 card-hover h-full flex flex-col">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/15 transition-colors">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-white/30">→</span>
                  <span className="text-blue-400 text-sm font-medium">{item.solution}</span>
                </div>
                
                <p className="text-white/50 text-sm leading-relaxed mb-6 flex-grow">
                  {item.description}
                </p>
                
                {/* Stat */}
                <div className="pt-6 border-t border-white/[0.06]">
                  <span className="gold-text text-sm font-semibold">{item.stat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
