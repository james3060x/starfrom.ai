'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Building2, Users2, Building } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: '基础版',
    price: '¥499',
    period: '/月',
    description: '适合小型团队起步',
    icon: Building2,
    features: [
      '3个Agent',
      '10个成员',
      '基础工作流',
      'SaaS部署',
      '邮件支持',
    ],
    cta: '开始试用',
    popular: false
  },
  {
    name: '专业版',
    price: '¥1,999',
    period: '/月',
    description: '适合中型企业全面AI化',
    icon: Users2,
    features: [
      '10个Agent',
      '50个成员',
      '高级工作流编排',
      'SaaS或混合部署',
      '成本看板',
      '优先技术支持',
    ],
    cta: '预约演示',
    popular: true
  },
  {
    name: '企业版',
    price: '定制',
    period: '',
    description: '适合大型企业私有化部署',
    icon: Building,
    features: [
      '无限Agent',
      '无限成员',
      '完整多Agent协作',
      '三种部署模式',
      '高级安全合规',
      '专属客户成功',
      '增值税专用发票',
    ],
    cta: '联系商务',
    popular: false
  }
]

export function EnterprisePricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="badge-neon mb-4 inline-block">付费订阅</span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            灵活的订阅方案
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            按企业规模、Agent数量、用量三轴计费，支持对公转账与增值税专用发票
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <Card 
                key={plan.name}
                className={`glass-card p-8 relative ${
                  plan.popular ? 'border-blue-500/30' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">
                      最受欢迎
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/40 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/40">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-white/70">
                      <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'glow-btn text-white' 
                        : 'bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-white/70'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 glass-card p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                三种部署模式，满足不同安全需求
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-lg">☁️</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">托管 SaaS</div>
                    <p className="text-white/40 text-sm">零配置，开箱即用，适合中小企业</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-lg">🔀</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">混合架构</div>
                    <p className="text-white/40 text-sm">知识库本地，模型云端，平衡安全与成本</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-lg">🏠</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">全本地部署</div>
                    <p className="text-white/40 text-sm">完全私有化，支持国产 ARM 服务器</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-white/60 mb-4">
                年付享 9 折优惠
                <br />
                支持对公转账与增值税专用发票
              </p>
              <Link href="/contact">
                <Button className="glow-btn text-white">
                  联系商务获取定制方案
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
