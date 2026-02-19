'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Workflow, Shield } from 'lucide-react'
import Link from 'next/link'

export function AgentOSHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#080810] to-[#050508]" />
      
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-sm text-blue-400">企业级 · 多Agent协作 · 付费订阅</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.1]">
            <span className="block">AgentOS</span>
            <span className="gradient-text text-4xl md:text-6xl lg:text-7xl">企业级多Agent协作平台</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/50 mb-8 max-w-2xl mx-auto leading-relaxed">
            从「一个Agent账号」升级为「企业全员AI工作台」。
            <br />
            支持三级权限、跨部门协作、团队智慧共建。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/contact">
              <Button size="lg" className="glow-btn text-white px-8 py-6 text-lg group">
                预约产品演示
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link href="#pricing">
              <Button size="lg" className="bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-white/70 hover:text-white px-8 py-6 text-lg">
                查看订阅方案
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="glass-card p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-white font-semibold mb-1">三级权限体系</div>
              <div className="text-white/40 text-sm">管理员 / 部门经理 / 员工</div>
            </div>
            
            <div className="glass-card p-6 text-center">
              <Workflow className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-white font-semibold mb-1">跨部门协作</div>
              <div className="text-white/40 text-sm">Agent串联编排工作流</div>
            </div>
            
            <div className="glass-card p-6 text-center">
              <Shield className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-white font-semibold mb-1">三种部署模式</div>
              <div className="text-white/40 text-sm">SaaS / 混合 / 全本地</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
