'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTASection() {
  return (
    <section className="relative py-32">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]" />
          
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm">限时免费</span>
            </div>
            
            {/* Heading */}
            <h2 className="font-display text-4xl md:text-5xl text-white mb-5">
              准备好开启<br />
              <span className="gradient-text">AI 智能化转型</span>？
            </h2>
            
            {/* Description */}
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto font-light">
              30 分钟免费诊断，0 费用，输出专属 AI 落地方案
            </p>
            
            {/* CTA Button */}
            <Link href="/diagnosis">
              <Button size="lg" className="glow-btn text-white px-10 py-7 text-lg">
                开始免费诊断
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
