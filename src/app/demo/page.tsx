import { Metadata } from 'next'
import { DemoChat } from '@/components/demo/DemoChat'

export const metadata: Metadata = {
  title: 'Demo 体验 - StarFrom AI',
  description: '在线体验 StarFrom AI 的智能客服、知识库问答、内容生成等 AI Agent 能力。',
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Demo 体验
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            在线体验 AI Agent 能力，选择不同场景感受效果
          </p>
        </div>

        <DemoChat />
      </div>
    </div>
  )
}
