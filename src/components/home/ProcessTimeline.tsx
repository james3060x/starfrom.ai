'use client'

import { homeContent } from '@/lib/content'

export function ProcessTimeline() {
  return (
    <section className="relative py-32">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="badge-neon mb-6">
            {homeContent['交付流程区域']['区域标签']}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-5">
            {homeContent['交付流程区域']['区域标题']}
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto font-light">
            {homeContent['交付流程区域']['区域描述']}
          </p>
        </div>
      </div>
    </section>
  )
}
