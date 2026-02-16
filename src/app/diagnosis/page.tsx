import { Metadata } from 'next'
import { DiagnosisWizard } from '@/components/diagnosis/DiagnosisWizard'

export const metadata: Metadata = {
  title: 'AI 需求诊断 - StarFrom AI',
  description: '免费 AI 需求诊断工具，5 分钟了解您的企业适合什么样的 AI 解决方案，获取专属落地方案。',
}

export default function DiagnosisPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI 需求诊断
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            5 分钟快速诊断，了解您的企业适合什么样的 AI 解决方案
          </p>
        </div>

        <DiagnosisWizard />
      </div>
    </div>
  )
}
