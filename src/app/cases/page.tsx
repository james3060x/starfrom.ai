import { Metadata } from 'next'
import { CasesList } from '@/components/cases/CasesList'

export const metadata: Metadata = {
  title: '成功案例 - StarFrom AI',
  description: '了解 StarFrom AI 如何帮助不同行业的企业提升效率、降低成本，实现 AI 智能化转型。',
}

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] py-16">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            成功案例
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            看看其他企业如何通过 AI 智能体提升效率
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        <CasesList />
      </div>
    </div>
  )
}
