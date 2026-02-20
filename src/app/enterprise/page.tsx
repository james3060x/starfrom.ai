import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Enterprise - 企业级 AI 解决方案 | StarFrom AI',
  description: '3天交付，成本仅需市场价30%。为企业提供专属 AI 智能体解决方案。',
}

export default function EnterprisePage() {
  const modules = [
    {
      category: '基础模块',
      items: [
        { name: '智能客服', description: '7×24小时在线，自动回复' },
        { name: '知识库问答', description: '基于文档的智能问答' },
        { name: '销售助手', description: '线索跟进，推荐产品' },
      ]
    },
    {
      category: '增值模块',
      items: [
        { name: '多Agent协作', description: '多个Agent协同工作' },
        { name: '业务系统集成', description: '对接ERP/CRM/OA' },
        { name: '数据分析看板', description: '可视化数据统计' },
        { name: '私有化部署', description: '数据完全本地化' },
      ]
    },
    {
      category: '持续服务',
      items: [
        { name: '基础维护', description: '知识库更新，bug修复' },
        { name: '高级运营', description: '月度报告，优化建议' },
        { name: '模型保鲜', description: '最新模型，持续升级' },
      ]
    },
  ]

  const industries = [
    { icon: '🛒', name: '电商', description: '智能客服、订单管理' },
    { icon: '🎓', name: '教育', description: '知识问答、课程推荐' },
    { icon: '🏥', name: '医疗', description: '患者咨询、预约管理' },
    { icon: '🏦', name: '金融', description: '风控审核、智能投顾' },
    { icon: '🏢', name: '企业服务', description: '内部知识库、审批流程' },
    { icon: '📱', name: 'SaaS', description: '产品助手、用户支持' },
  ]

  const timeline = [
    { day: 'Day 1', title: '需求诊断', description: '深入了解业务场景，明确AI应用场景' },
    { day: 'Day 2', title: 'Demo演示', description: '展示真实效果，确认方案可行性' },
    { day: 'Day 3', title: '签约部署', description: '签署协议、配置部署、测试验收' },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold text-white">StarFrom</span>
            <span className="text-xl font-bold text-cyan-400">.AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/services" className="text-slate-300 hover:text-white transition-colors">
              服务
            </Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">
              定价
            </Link>
            <Link href="/cases" className="text-slate-300 hover:text-white transition-colors">
              案例
            </Link>
            <Link href="/solo" className="text-slate-300 hover:text-white transition-colors">
              Solo
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white">
                登录
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                联系咨询
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              3 天交付
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              企业级 AI 解决方案
              <span className="text-cyan-400"> 3天交付</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8">
              成本仅需市场价 30%，模板化快速上线<br />
              专属 AI 智能体，为企业降本增效
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-lg px-8">
                  预约演示
                </Button>
              </Link>
              <Link href="/diagnosis">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-lg px-8">
                  免费诊断
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            模块化服务
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            从基础模块开始，根据业务需求灵活叠加功能模块
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4">{module.category}</h3>
                <ul className="space-y-3">
                  {module.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-white text-sm">{item.name}</p>
                        <p className="text-slate-400 text-xs">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            行业方案
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            针对不同行业提供专属解决方案
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/20 transition-colors text-center"
              >
                <div className="text-3xl mb-2">{industry.icon}</div>
                <h3 className="text-white font-medium text-sm">{industry.name}</h3>
                <p className="text-slate-400 text-xs mt-1">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            交付流程
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            标准化交付流程，确保高质量准时交付
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="relative p-6 rounded-2xl bg-white/5 border border-white/5">
                {index < timeline.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-px bg-white/10 -translate-y-1/2" style={{ maxWidth: '40px' }} />
                )}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 font-bold mb-4">
                  {item.day}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备好升级你的企业了吗？
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            30 分钟免费诊断，0 费用，输出专属 AI 落地方案
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/diagnosis">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-lg px-8">
                免费 AI 诊断
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-lg px-8">
                联系咨询
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <span className="text-white font-medium">StarFrom.AI</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2026 StarFrom AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
