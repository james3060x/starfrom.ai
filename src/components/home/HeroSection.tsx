'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Shield, Clock, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { homeContent } from '@/lib/content'

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { hero } = homeContent

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    { icon: Clock, label: hero.pills[0].label, desc: hero.pills[0].desc },
    { icon: Zap, label: hero.pills[1].label, desc: hero.pills[1].desc },
    { icon: Shield, label: hero.pills[2].label, desc: hero.pills[2].desc },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Dynamic Background - Mouse Follow */}
      <div 
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
        }}
      >
        {/* Deep Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#080810] to-[#050508]" />
        
        {/* Large Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px] float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[150px] float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[200px]" />
      </div>
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 tech-grid opacity-40" />
      
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-sm mb-10">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white/70">{hero.badge}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-mono">{hero.version}</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[1.1]">
            <span className="block mb-2">{hero.title}</span>
            <span className="gradient-text">{hero.titleHighlight}</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/50 mb-6 max-w-2xl mx-auto leading-relaxed">
            {hero.subtitle.split(hero.subtitleHighlight1)[0]}<span className="text-blue-400 font-semibold">{hero.subtitleHighlight1}</span>{hero.subtitle.split(hero.subtitleHighlight1)[1].split(hero.subtitleHighlight2)[0]}<span className="gold-text font-semibold">{hero.subtitleHighlight2}</span>{hero.subtitle.split(hero.subtitleHighlight2)[1]}
          </p>
          
          <p className="text-base text-white/40 mb-12 max-w-xl mx-auto">
            {hero.features}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/diagnosis">
              <Button size="lg" className="glow-btn text-white px-8 py-6 text-lg group">
                <Sparkles className="mr-2 w-5 h-5" />
                {hero.ctaPrimary}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/services">
              <Button 
                size="lg" 
                className="secondary-btn text-white/80 px-8 py-6 text-lg hover:text-white"
              >
                {hero.ctaSecondary}
              </Button>
            </Link>
          </div>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.05] hover:border-blue-500/20 transition-all duration-300"
              >
                <feature.icon className="w-5 h-5 text-blue-400" />
                <div className="text-left">
                  <div className="text-white text-sm font-semibold">{feature.label}</div>
                  <div className="text-white/40 text-xs">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050508] to-transparent" />
    </section>
  )
}
