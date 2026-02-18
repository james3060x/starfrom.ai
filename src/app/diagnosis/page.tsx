import { Metadata } from 'next'
import { DiagnosisWizard } from '@/components/diagnosis/DiagnosisWizard'

export const metadata: Metadata = {
  title: 'AI 需求诊断 - StarFrom AI',
  description: '免费 AI 需求诊断工具，5 分钟了解您的企业适合什么样的 AI 解决方案，获取专属落地方案。',
}

export default function DiagnosisPage() {
  return (
    <div className="min-h-screen relative">
      <div className="relative pt-32 pb-16">
        <div className="container max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="badge-neon mb-6 inline-block">
            免费诊断
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
            AI 需求诊断
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            5 分钟快速诊断，了解您的企业适合什么样的 AI 解决方案
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 pb-12">
        <DiagnosisWizard />
      </div>
    </div>
  )
}
