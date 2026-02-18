'use client'

import { Check, Layers } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { Module } from '@/lib/constants'

const baseFeatures = [
  '1个核心Agent（客服/知识库/销售助手）',
  '基础RAG知识库（PDF/Word/网页）',
  'Dify/FastGPT可视化管理后台',
  'DeepSeek API国产模型接入',
  '网页嵌入/微信基础对话界面',
  '1次线上培训 + 7天售后支持',
]

export function BaseModuleSection() {
  return (
    <section className="py-16">
      <div className="mb-8">
        <span className="badge-neon mb-4 inline-block">必选底座</span>
        <h2 className="text-2xl font-bold text-white mb-2">基础模块</h2>
        <p className="text-white/50">每个客户必选的底座，包含核心功能</p>
      </div>
      
      <div className="glass-card overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-pink-500 to-blue-500" />
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Layers className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">基础模块</h3>
                  <p className="text-white/40">必选底座</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {baseFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center mt-0.5 flex-shrink-0 border border-blue-500/20">
                      <Check className="w-3 h-3 text-blue-400" />
                    </div>
                    <span className="text-white/70">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-white mb-4">交付周期</h4>
                <p className="text-3xl font-bold gradient-text mb-2">1-3天</p>
                <p className="text-sm text-white/40">最快1天完成基础部署</p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/[0.06]">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-white/40">价格</span>
                  <span className="text-3xl font-bold gradient-text">¥10,000 - ¥20,000</span>
                </div>
                <p className="text-sm text-white/40 mt-1">一次性费用</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function PluginModulesSection() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchModules() {
      const supabase = createClient()
      const { data } = await supabase
        .from('service_modules')
        .select('*')
        .eq('type', 'plugin')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      
      if (data) setModules(data)
      setLoading(false)
    }
    fetchModules()
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="mb-8">
          <span className="badge-pink mb-4 inline-block">灵活叠加</span>
          <h2 className="text-2xl font-bold text-white mb-2">增值模块</h2>
          <p className="text-white/50">根据业务需求灵活叠加功能模块</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="h-48 bg-white/[0.02] rounded-2xl animate-pulse border border-white/[0.06]" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="mb-8">
        <span className="badge-pink mb-4 inline-block">灵活叠加</span>
        <h2 className="text-2xl font-bold text-white mb-2">增值模块</h2>
        <p className="text-white/50">根据业务需求灵活叠加功能模块</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const features = (module.features as string[]) || []
          
          return (
            <div key={module.id} className="glass-card p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{module.icon}</span>
                <span className="px-2 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/50 text-xs">
                  {module.category}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{module.name}</h3>
              <p className="text-sm text-white/40 mb-4">{module.description}</p>
              
              <div className="space-y-2 mb-4">
                {features.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                    <span className="text-sm text-white/60">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold gradient-text">
                    ¥{module.price_min?.toLocaleString()} - {module.price_max?.toLocaleString()}
                  </span>
                  <span className="text-sm text-white/40 ml-1">{module.price_unit}</span>
                </div>
                <span className="text-xs text-white/30">{module.delivery_days}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function SubscriptionSection() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchModules() {
      const supabase = createClient()
      const { data } = await supabase
        .from('service_modules')
        .select('*')
        .eq('type', 'subscription')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      
      if (data) setModules(data)
      setLoading(false)
    }
    fetchModules()
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="mb-8">
          <span className="badge-neon mb-4 inline-block">长期运维</span>
          <h2 className="text-2xl font-bold text-white mb-2">持续服务</h2>
          <p className="text-white/50">长期运维支持，选择一档适合您的</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white/[0.02] rounded-2xl animate-pulse border border-white/[0.06]" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="mb-8">
        <span className="badge-neon mb-4 inline-block">长期运维</span>
        <h2 className="text-2xl font-bold text-white mb-2">持续服务</h2>
        <p className="text-white/50">长期运维支持，选择一档适合您的</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((module) => {
          const features = (module.features as string[]) || []
          
          return (
            <div key={module.id} className="glass-card overflow-hidden card-hover">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-pink-400" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{module.icon}</span>
                  <div>
                    <h3 className="font-bold text-white">{module.name}</h3>
                    <p className="text-sm text-white/40">{module.category}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/60">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold gradient-text">¥{module.price_min?.toLocaleString()}</span>
                    <span className="text-white/40">{module.price_unit}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
