import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Solo Plan - 个人开发者的 AI 助手平台 | StarFrom AI',
  description: '¥99/月，5个Agent，2GB知识库，10,000次API调用。10分钟搭建你的专属AI助手。',
}

export default function SoloPage() {
  const features = [
    {
      icon: '🤖',
      title: '5 个 Agent',
      description: '创建多个不同功能的 AI 助手',
    },
    {
      icon: '📚',
      title: '2 GB 知识库',
      description: '上传文档让 AI 基于知识库回答',
    },
    {
      icon: '⚡',
      title: '10,000 次 API 调用',
      description: '充足的 API 额度用于开发集成',
    },
    {
      icon: '🎯',
      title: '零门槛配置',
      description: '无需编程，图形界面轻松配置',
    },
    {
      icon: '🔌',
      title: 'Open API',
      description: '通过 API 集成到任何应用',
    },
    {
      icon: '💬',
      title: 'MCP 协议',
      description: '支持 Claude Desktop / Cursor 集成',
    },
  ]

  const useCases = [
    {
      icon: '📝',
      title: '个人博客助手',
      description: '自动回复读者评论，生成文章摘要',
    },
    {
      icon: '💻',
      title: '编程学习伙伴',
      description: '解答编程问题，审查代码，提供建议',
    },
    {
      icon: '✍️',
      title: '内容创作工具',
      description: '生成营销文案、社交媒体内容',
    },
  ]

  const plans = [
    {
      name: '免费试用',
      price: '¥0',
      period: '/7天',
      description: '体验基础功能',
      features: [
        '1 个 Agent',
        '500MB 知识库',
        '1,000 次 API 调用',
        '社区支持',
      ],
      cta: '免费试用',
      href: '/auth/signup',
      popular: false,
    },
    {
      name: 'Solo Plan',
      price: '¥99',
      period: '/月',
      description: '个人开发者首选',
      features: [
        '5 个 Agent',
        '2 GB 知识库',
        '10,000 次 API 调用',
        'Open API 访问',
        'MCP 协议支持',
        '邮件支持',
      ],
      cta: '立即订阅',
      href: '/auth/signup',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '¥1万起',
      period: '',
      description: '企业定制方案',
      features: [
        '无限 Agent',
        '无限知识库',
        '无限 API 调用',
        '私有化部署',
        '1 对 1 顾问',
        '优先支持',
      ],
      cta: '联系销售',
      href: '/contact',
      popular: false,
    },
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
            <Link href="/demo" className="text-slate-300 hover:text-white transition-colors">
              Demo
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white">
                登录
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                免费试用
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-pink-500/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              10 分钟上线
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              个人开发者的
              <span className="text-cyan-400"> AI 助手平台</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8">
              ¥99/月，5个Agent，2GB知识库，10,000次API调用<br />
              无需编程基础，图形界面轻松配置
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-lg px-8">
                  免费试用 7 天
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-lg px-8">
                  体验 Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors text-center"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="text-white font-medium text-sm">{feature.title}</h3>
                <p className="text-slate-400 text-xs mt-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            使用场景
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Solo Plan 适合各种个人开发者场景
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/20 transition-colors"
              >
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{useCase.title}</h3>
                <p className="text-slate-400">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            定价方案
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            选择适合你的方案，按需升级
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border transition-all ${
                  plan.popular
                    ? 'bg-cyan-500/10 border-cyan-500/30 scale-105'
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-500 text-white text-xs font-medium">
                      最受欢迎
                    </span>
                  </div>
                )}
                
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                <p className="text-slate-400 text-sm mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                      <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link href={plan.href} className="block">
                  <Button
                    className={`w-full ${plan.popular ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-cyan-500/10 to-pink-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备好开始了吗？
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            10 分钟创建你的第一个 AI 助手，体验前沿 AI 技术的便利
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-lg px-8">
              免费试用 7 天
            </Button>
          </Link>
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
