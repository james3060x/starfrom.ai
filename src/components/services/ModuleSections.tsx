'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">基础模块</h2>
        <p className="text-gray-600">每个客户必选的底座，包含核心功能</p>
      </div>
      
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#1e3a5f] to-[#06b6d4]" />
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-[#1e3a5f] rounded-2xl flex items-center justify-center">
                  <Layers className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">基础模块</h3>
                  <p className="text-gray-500">必选底座</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {baseFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#06b6d4]/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="w-3 h-3 text-[#06b6d4]" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">交付周期</h4>
                <p className="text-3xl font-bold text-[#1e3a5f] mb-2">1-3天</p>
                <p className="text-sm text-gray-500">最快1天完成基础部署</p>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-500">价格</span>
                  <span className="text-3xl font-bold text-[#1e3a5f]">¥10,000 - ¥20,000</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">一次性费用</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">增值模块</h2>
          <p className="text-gray-600">根据业务需求灵活叠加</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">增值模块</h2>
        <p className="text-gray-600">根据业务需求灵活叠加功能模块</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const features = (module.features as string[]) || []
          
          return (
            <Card key={module.id} className="border-0 shadow hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{module.icon}</span>
                  <Badge variant="outline">{module.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{module.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{module.description}</p>
                
                <div className="space-y-2 mb-4">
                  {features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full mt-1.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-[#1e3a5f]">
                      ¥{module.price_min?.toLocaleString()} - {module.price_max?.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">{module.price_unit}</span>
                  </div>
                  <span className="text-xs text-gray-400">{module.delivery_days}</span>
                </div>
              </CardContent>
            </Card>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">持续服务</h2>
          <p className="text-gray-600">长期运维支持，选择一档适合您的</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">持续服务</h2>
        <p className="text-gray-600">长期运维支持，选择一档适合您的</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((module) => {
          const features = (module.features as string[]) || []
          
          return (
            <Card key={module.id} className="border-0 shadow hover:shadow-lg transition-shadow">
              <div className="h-1 bg-gradient-to-r from-[#06b6d4] to-[#1e3a5f]" />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{module.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{module.name}</h3>
                    <p className="text-sm text-gray-500">{module.category}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#06b6d4] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#1e3a5f]">¥{module.price_min?.toLocaleString()}</span>
                    <span className="text-gray-500">{module.price_unit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
