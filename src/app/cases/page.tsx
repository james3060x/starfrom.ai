import { Metadata } from 'next'
import { CasesList } from '@/components/cases/CasesList'

export const metadata: Metadata = {
  title: '成功案例 - StarFrom AI',
  description: '了解 StarFrom AI 如何帮助不同行业的企业提升效率、降低成本，实现 AI 智能化转型。',
}

export default function CasesPage() {
  return (
    <div className="min-h-screen relative">
      <div className="relative pt-32 pb-16">
        <div className="container max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="badge-neon mb-6 inline-block">
            客户案例
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
            成功案例
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            看看其他企业如何通过 AI 智能体提升效率
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 pb-12">
        <CasesList />
      </div>
    </div>
  )
}
