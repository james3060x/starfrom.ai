import { Metadata } from 'next'
import { DemoChat } from '@/components/demo/DemoChat'

export const metadata: Metadata = {
  title: 'Demo 体验 - StarFrom AI',
  description: '在线体验 StarFrom AI 的智能客服、知识库问答、内容生成等 AI Agent 能力。',
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#030305] text-white relative">
      <div className="relative pt-32 pb-16">
        <div className="container max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="badge-pink mb-6 inline-block">
            在线体验
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">
            Demo 体验
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            在线体验 AI Agent 能力，选择不同场景感受效果
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 pb-12">
        <DemoChat />
      </div>
    </div>
  )
}
