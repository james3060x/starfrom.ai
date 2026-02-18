import { Shield, Lock, FileCheck } from 'lucide-react'

const deploymentModes = [
  {
    title: 'SaaS 多租户',
    description: '共享云资源，成本最低',
    features: ['快速部署', '自动更新', '按需付费'],
    badge: '推荐试用',
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30'
  },
  {
    title: '混合云',
    description: '核心数据本地，计算上云',
    features: ['数据本地化', '弹性扩展', '成本可控'],
    badge: '平衡方案',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  {
    title: '私有化部署',
    description: '完全本地部署，数据隔离',
    features: ['数据完全隔离', '内网访问', '合规审计'],
    badge: '高安全',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }
]

export function ComplianceSection() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <span className="badge-neon mb-4 inline-block">安全合规</span>
        <h2 className="text-2xl font-bold text-white mb-2">数据安全与合规</h2>
        <p className="text-white/50">多种部署模式，满足不同安全等级要求</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {deploymentModes.map((mode, index) => (
          <div key={index} className="glass-card relative overflow-hidden card-hover">
            <div className={`absolute top-0 right-0 text-xs px-3 py-1 rounded-bl-lg border ${mode.badgeColor}`}>
              {mode.badge}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">{mode.title}</h3>
              <p className="text-sm text-white/40 mb-4">{mode.description}</p>

              <div className="space-y-2">
                {mode.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white/60">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="flex items-center justify-center gap-8 flex-wrap relative z-10">
          <div className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>数据不出境</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <FileCheck className="w-5 h-5 text-blue-400" />
            <span>遵循《生成式AI服务管理暂行办法》</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Lock className="w-5 h-5 text-blue-400" />
            <span>签署 DPA 数据处理协议</span>
          </div>
        </div>
      </div>
    </section>
  )
}
