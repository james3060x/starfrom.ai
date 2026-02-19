import { Metadata } from 'next'
import { AgentOSHero } from '@/components/agentos/AgentOSHero'
import { MultiAgentShowcase } from '@/components/agentos/MultiAgentShowcase'
import { CollaborationFlow } from '@/components/agentos/CollaborationFlow'
import { EnterprisePricing } from '@/components/agentos/EnterprisePricing'

export const metadata: Metadata = {
  title: 'AgentOS - 企业级多Agent协作平台 | StarFrom AI',
  description: 'AgentOS是企业级多Agent协作平台，支持三级权限体系、跨部门Agent协作编排、团队智慧共建。按企业规模灵活订阅。',
}

export default function AgentOSPage() {
  return (
    <div className="min-h-screen bg-[#030305] text-white relative">
      <AgentOSHero />
      <MultiAgentShowcase />
      <CollaborationFlow />
      <EnterprisePricing />
    </div>
  )
}
