import { Card, CardContent } from '@/components/ui/card'
import { Shield, Lock, FileCheck } from 'lucide-react'

const deploymentModes = [
  {
    title: 'SaaS 多租户',
    description: '共享云资源，成本最低',
    features: ['快速部署', '自动更新', '按需付费'],
    badge: '推荐试用',
    badgeColor: 'bg-green-500'
  },
  {
    title: '混合云',
    description: '核心数据本地，计算上云',
    features: ['数据本地化', '弹性扩展', '成本可控'],
    badge: '平衡方案',
    badgeColor: 'bg-blue-500'
  },
  {
    title: '私有化部署',
    description: '完全本地部署，数据隔离',
    features: ['数据完全隔离', '内网访问', '合规审计'],
    badge: '高安全',
    badgeColor: 'bg-purple-500'
  }
]

export function ComplianceSection() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">数据安全与合规</h2>
        <p className="text-gray-600">多种部署模式，满足不同安全等级要求</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {deploymentModes.map((mode, index) => (
          <Card key={index} className="border-0 shadow-lg relative overflow-hidden">
            <div className={`absolute top-0 right-0 ${mode.badgeColor} text-white text-xs px-3 py-1 rounded-bl-lg`}>
              {mode.badge}
            </div>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{mode.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{mode.description}</p>
              
              <div className="space-y-2">
                {mode.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#06b6d4]" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-[#1e3a5f] rounded-2xl p-8 text-center">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5 text-[#06b6d4]" />
            <span>数据不出境</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <FileCheck className="w-5 h-5 text-[#06b6d4]" />
            <span>遵循《生成式AI服务管理暂行办法》</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Lock className="w-5 h-5 text-[#06b6d4]" />
            <span>签署 DPA 数据处理协议</span>
          </div>
        </div>
      </div>
    </section>
  )
}
